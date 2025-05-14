from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, udf
from pyspark.sql.types import StructType, StringType, IntegerType
import uuid

# Initialize Spark session with Cassandra config
spark = SparkSession.builder \
    .appName("KafkaMultiTopicConsumer") \
    .config("spark.cassandra.connection.host", "127.0.0.1") \
    .config("spark.cassandra.connection.port", "9042") \
    .getOrCreate()

# Schema for signup data
signup_schema = StructType() \
    .add("username", StringType()) \
    .add("password", StringType())

joinServer_schema = StructType() \
    .add("username", StringType()) \
    .add("server_id", IntegerType())

sendMessage_schema =  StructType() \
    .add("username", StringType()) \
    .add("server_id", IntegerType())\
    .add("messages", StringType())

# Schema for chat message data
chat_schema = StructType() \
    .add("server", StringType()) \
    .add("receiver", StringType()) \
    .add("content", StringType()) \
    .add("timestamp", StringType())

# Generic Kafka topic processor
def process(topic_name, table_name, schema):
    df = spark.readStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", "localhost:9092") \
        .option("subscribe", topic_name) \
        .option("startingOffsets", "latest") \
        .load()

    # Convert binary Kafka value to string
    df_string = df.selectExpr("CAST(value AS STRING)")

    # Parse JSON and extract fields
    df_parsed = df_string.select(from_json(col("value"), schema).alias("data")).select("data.*")

    # Function to write each micro-batch to Cassandra
    def write_to_cassandra(batch_df, _):
        try:
            batch_df.write \
                .format("org.apache.spark.sql.cassandra") \
                .mode("append") \
                .options(table=table_name, keyspace="chat_system_data") \
                .save()
            print(f"Successfully wrote batch to Cassandra")
        except Exception as e:
            print(f"Failed to write batch to Cassandra: {str(e)}")

    return df_parsed.writeStream \
        .foreachBatch(write_to_cassandra) \
        .outputMode("append") \
        .start()

# UDF to generate a time-based UUID (UUIDv1)
generate_timeuuid = udf(lambda: str(uuid.uuid1()), StringType())
def processMessage(topic_name, table_name, schema):
    df = spark.readStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", "localhost:9092") \
        .option("subscribe", topic_name) \
        .option("startingOffsets", "latest") \
        .load()

    df_string = df.selectExpr("CAST(value AS STRING)")

    df_parsed = df_string.select(from_json(col("value"), schema).alias("data")).select("data.*")

    # Add a timeuuid-compatible field using current timestamp
    df_with_timeuuid = df_parsed.withColumn("message_id", generate_timeuuid())

    def write_to_cassandra(batch_df, _):
        try:
            batch_df.write \
                .format("org.apache.spark.sql.cassandra") \
                .mode("append") \
                .options(table=table_name, keyspace="chat_system_data") \
                .save()
            print(f"Successfully wrote batch to Cassandra")
        except Exception as e:
            print(f"Failed to write batch to Cassandra: {str(e)}")

    return df_with_timeuuid.writeStream \
        .foreachBatch(write_to_cassandra) \
        .outputMode("append") \
        .start()

# Start consumers for each topic
query_signup = process("UserSignupTopic", "users", signup_schema)
query_chat = process("UserChatTopic", "messages", chat_schema)
query_JoinServer = process("JoinServerTopic", "user_servers", joinServer_schema)
query_sendMessage = processMessage("SendMessageTopic", "messages_data", sendMessage_schema)


# Keep the stream running
query_signup.awaitTermination()
query_chat.awaitTermination()
query_JoinServer.awaitTermination()
query_sendMessage.awaitTermination()

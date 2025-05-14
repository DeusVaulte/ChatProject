from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col
from pyspark.sql.types import StructType, StringType, IntegerType

# Initialize Spark Session
spark = SparkSession.builder \
    .appName("Kafka-Spark-Cassandra") \
    .config("spark.cassandra.connection.host", "127.0.0.1") \
    .config("spark.cassandra.connection.port", "9042") \
    .config("spark.hadoop.io.native.lib.available", "false") \
    .getOrCreate()

# Define schema for the incoming JSON data
schema = StructType() \
    .add("timeuuid_id", StringType()) \
    .add("lgu_code", StringType()) \
    .add("sensor_id", StringType()) \
    .add("date_saved", StringType()) \
    .add("time_saved", StringType()) \
    .add("total", IntegerType()) \
    .add("car", IntegerType()) \
    .add("bus", IntegerType()) \
    .add("truck", IntegerType()) \
    .add("jeepney", IntegerType()) \
    .add("bike", IntegerType()) \
    .add("tryke", IntegerType()) \
    .add("others", IntegerType())

# Kafka parameters
kafka_broker = "localhost:9092"
kafka_topic = "Traffic"

# Create a streaming DataFrame by reading from the Kafka topic
kafka_df = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", kafka_broker) \
    .option("subscribe", kafka_topic) \
    .option("startingOffsets", "latest") \
    .load()

# Kafka data comes in as a byte stream, convert 'value' column from bytes to string
kafka_df = kafka_df.selectExpr("CAST(value AS STRING)")

# Parse the JSON messages in the Kafka stream
parsed_df = kafka_df.select(from_json(col("value"), schema).alias("data")).select("data.*")

# Write the processed stream to Cassandra
def write_to_cassandra(batch_df, batch_id):
    batch_df.write \
        .format("org.apache.spark.sql.cassandra") \
        .mode('append') \
        .options(table="traffic_data", keyspace="vehicle_traffic") \
        .save()

# Set up the query to process and write the data to Cassandra
query = parsed_df.writeStream \
    .foreachBatch(write_to_cassandra) \
    .outputMode("append") \
    .start()

# Wait for the streaming to finish
query.awaitTermination()
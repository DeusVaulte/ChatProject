from flask import Flask, request, jsonify
from flask_cors import CORS
from kafka import KafkaProducer
from cassandra.cluster import Cluster
import json
import pandas as pd

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)

producer = KafkaProducer(
    bootstrap_servers='127.0.0.1:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Cassandra read connection
cluster = Cluster(['127.0.0.1'], port=9042)
session = cluster.connect('chat_system_data')

@app.route('/getServers', methods=['GET'])
def get_servers():
    query = "SELECT * FROM servers;"  # Adjust to your Cassandra table name
    results = session.execute(query)
    servers = [{"server_id": row.server_id, "server_name": row.server_name} for row in results]  # Adjust fields as needed
    return jsonify(servers)

@app.route('/getJoinedServers', methods=['GET'])
def getJoinedServers():
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400
    
    query = f"SELECT server_id FROM user_servers WHERE username='{username}';"
    result = session.execute(query)
    query1 = f"SELECT * FROM servers;"
    result1 = session.execute(query1)
    rows1 = result1.all()
    df1 = pd.DataFrame(rows1)
    rows = result.all()
    df = pd.DataFrame(rows)
    merged_df = df.merge(df1, on='server_id', how='inner')
    merged_data = merged_df.to_dict(orient='records')
    return jsonify(merged_data)

@app.route('/getMessages', methods=['GET'])
def getMessages():
    server_id = request.args.get('server_id')
    query = f"SELECT * FROM messages_data WHERE server_id={server_id};"
    result = session.execute(query) 
    rows = result.all()
    df = pd.DataFrame(rows)
    dfSend = df.to_dict(orient='records')
    return jsonify(dfSend)

@app.route('/sendMessage', methods=['POST'])
def sendMessage():
    data = request.json
    print("Received message:", data)
    producer.send('SendMessageTopic', data)
    return jsonify({"status": "message sent"}), 200


@app.route('/joinServers', methods=['POST'])
def joinServers():
    data = request.json
    username = data.get('username')
    server_id = data.get('server_id')
    # Optional: check for existing username in Cassandra
    query = f"SELECT * FROM user_servers WHERE username='{username}' AND server_id={server_id};"
    result = session.execute(query)
    if result.one():
        return jsonify({"error": "You have already Joined that server"}), 400

    producer.send('JoinServerTopic', data)
    return jsonify({"status": "User join server data sent"}), 200

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    # Optional: check for existing username in Cassandra
    query = f"SELECT * FROM users WHERE username='{data['username']}';"
    result = session.execute(query)
    if result.one():
        return jsonify({"error": "Username already exists"}), 400

    producer.send('UserSignupTopic', data)
    return jsonify({"status": "User signup data sent"}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Check if user exists
    query = f"SELECT * FROM users WHERE username = '{username}';"
    result = session.execute(query)
    user = result.one()

    if user.password == password:
        return jsonify({"status": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401





if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

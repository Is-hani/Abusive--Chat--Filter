import os
import pickle
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

# Flask app setup
app = Flask(__name__)
socketio = SocketIO(app)

# Get the absolute paths to model files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILE = os.path.join(BASE_DIR, "model", "abuse_model.pkl")
VECTORIZER_FILE = os.path.join(BASE_DIR, "model", "vectorizer.pkl")

# Load model and vectorizer
with open(MODEL_FILE, "rb") as f:
    model = pickle.load(f)

with open(VECTORIZER_FILE, "rb") as f:
    vectorizer = pickle.load(f)

# Function to check if message is abusive
def is_abusive(comment):
    vec = vectorizer.transform([comment])
    return model.predict(vec)[0] == 1

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(data):
    user, msg = data['user'], data['message']
    if not is_abusive(msg):
        emit('message', {'user': user, 'message': msg}, broadcast=True)
    else:
        emit('message', {'user': 'SYSTEM', 'message': f"⚠️ Abusive comment blocked from {user}."}, broadcast=True)

# Start server
if __name__ == '__main__':
    socketio.run(app, debug=True)

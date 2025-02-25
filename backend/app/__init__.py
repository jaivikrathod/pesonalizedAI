from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO,send

socketio = SocketIO(cors_allowed_origins="*")  # Initialize socket globally

def create_app():
    app = Flask(__name__)
    CORS(app)

    socketio.init_app(app)  # Attach SocketIO to the app

    from app.routes import register_routes
    register_routes(app)

    return app


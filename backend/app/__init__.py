from flask import Flask
from flask_cors import CORS
from .routes import register_routes

def create_app():
    app = Flask(__name__)

    # Enable CORS for the frontend
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

    # Register the routes
    register_routes(app)

    return app

from flask import Flask
from flask_cors import CORS
from app.routes import qa_routes


def create_app():
    app = Flask(__name__)
    
    # Enable CORS for the frontend
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
    
    # Register the routes blueprint
    app.register_blueprint(qa_routes)
    
    return app
# Create the app and run
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
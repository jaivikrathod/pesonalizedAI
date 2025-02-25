from .controllers.qa_controller import qa_routes
from .controllers.chat_controller import chat_routes  # Import chat routes
from flask import send_from_directory
import os

def register_routes(app):
    app.register_blueprint(qa_routes, url_prefix='/qa')
    app.register_blueprint(chat_routes, url_prefix='/chat')  # Register chat routes
    UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads") 
    print(UPLOAD_FOLDER)
    @app.route("/media/<filename>")
    def get_media(filename):
        return send_from_directory(UPLOAD_FOLDER, filename)
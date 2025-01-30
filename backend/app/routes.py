from .controllers.qa_controller import qa_routes
from .controllers.chat_controller import chatBot

def register_routes(app):
    app.register_blueprint(qa_routes, url_prefix='/qa')
    app.register_blueprint(chatBot, url_prefix='/chat')

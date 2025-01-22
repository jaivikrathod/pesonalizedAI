from .controllers.qa_controller import qa_routes

def register_routes(app):
    # Register blueprints
    app.register_blueprint(qa_routes, url_prefix='/qa')

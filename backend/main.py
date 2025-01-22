from flask import Flask
from flask_cors import CORS
from app import create_app

# Create and configure the app
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)

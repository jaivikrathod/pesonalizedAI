import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.models.qa_model import insert_qa_data
from datetime import datetime

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

qa_routes = Blueprint("qa_routes", __name__)

@qa_routes.route("/set-qa", methods=["POST"])
def set_qa():
    try:
        userid = request.form.get("userid") 
        QA = request.form.get("QA")  
        media_files = request.files.getlist("media")  

        import json
        QA = json.loads(QA) if QA else {}

        file_names = []
        for file in media_files:
            if file:
                timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
                filename = f"{timestamp}_{userid}_{secure_filename(file.filename)}"
                file.save(os.path.join(UPLOAD_FOLDER, filename))
                file_names.append(filename)

        inserted_id = insert_qa_data(userid, QA, file_names)

        return jsonify({"message": "QA data added successfully!", "id": str(inserted_id)}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

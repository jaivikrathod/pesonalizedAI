from flask import Blueprint, request, jsonify
from app.models.qa_model import insert_qa_data

# Create a blueprint for QA routes
qa_routes = Blueprint('qa_routes', __name__)

@qa_routes.route('/set-qa', methods=['POST'])
def set_qa():
    try:
        data = request.get_json()
        userid = data['userid']
        QA = data['QA']

        inserted_id = insert_qa_data(userid,QA)

        return jsonify({"message": "QA data added successfully!", "id": str(inserted_id)}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

from flask import Blueprint, request, jsonify
from app.models.qa_model import insert_qa_data

# Create a blueprint for QA routes
qa_routes = Blueprint('qa_routes', __name__)

@qa_routes.route('/set-qa', methods=['POST'])
def set_qa():
    try:
        # Get the data from the request
        data = request.get_json()

        # Validate request data
        # if not all(key in data for key in ['userid', 'QA']):
        #     return jsonify({"error": "Missing required fields"}), 400
        # if not all(key in data['QA'] for key in ['question', 'answer', 'paraphrases']):
        #     return jsonify({"error": "Missing QA fields"}), 400

        # Extract data from the request
        userid = data['userid']
        question = data['question']
        answer = data['answer']
        paraphrases = data['paraphrases']

        # Insert data into MongoDB
        inserted_id = insert_qa_data(userid, question, answer, paraphrases)

        # Return a success response with the inserted ID
        return jsonify({"message": "QA data added successfully!", "id": str(inserted_id)}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

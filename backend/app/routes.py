from flask import Blueprint, request, jsonify
from app.models import insert_qa_data

# Create a blueprint for routes
qa_routes = Blueprint('qa_routes', __name__)

@qa_routes.route('/set-qa', methods=['POST'])
def set_qa():
    try:
        # Get the data from the request
        data = request.get_json()
        
        # Extract data from the request
        userid = data['userid']
        question = data['QA']['question']
        answer = data['QA']['answer']
        paraphrases = data['QA']['paraphrases']
        
        # Insert data into MongoDB
        inserted_id = insert_qa_data(userid, question, answer, paraphrases)
        
        # Return a success response with inserted ID
        return jsonify({"message": "QA data added successfully!", "id": str(inserted_id)}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

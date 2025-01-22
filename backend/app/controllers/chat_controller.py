from flask import Blueprint, request, jsonify
from sentence_transformers import SentenceTransformer, util
import torch
from app.models.qa_model import load_dataset

# Load pre-trained model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Prepare dataset and embeddings
qa_data = load_dataset()
embeddings = []
question_groups = []

def prepare_embeddings():
    global embeddings, question_groups
    for pair in qa_data:
        question = pair["QA"]["question"]
        paraphrases = pair["QA"].get("paraphrases", [])
        all_related = [question] + paraphrases
        embeddings.append(model.encode(all_related, convert_to_tensor=True))
        question_groups.append({
            "main_question": question,
            "answer": pair["QA"]["answer"],
            "all_related": all_related
        })

prepare_embeddings()

def get_answer(customer_question, threshold=0.5):
    if not customer_question.strip():
        return "I'm sorry, I didn't understand your question. Please try again."

    customer_embedding = model.encode(customer_question, convert_to_tensor=True)
    best_match = None
    best_score = -1

    for group, group_embeddings in zip(question_groups, embeddings):
        scores = util.cos_sim(customer_embedding, group_embeddings).squeeze(0)
        top_score, top_idx = torch.max(scores, dim=0)

        if top_score.item() > best_score and top_score.item() >= threshold:
            best_match = {
                "main_question": group["main_question"],
                "answer": group["answer"],
                "matched_question": group["all_related"][top_idx.item()],
                "score": top_score.item()
            }
            best_score = top_score.item()

    if best_match:
        return {
            "matched_question": best_match['matched_question'],
            "answer": best_match['answer'],
            "score": best_match['score']
        }

    return {"message": "I'm sorry, I couldn't find a suitable answer. Could you rephrase your question?"}

# Define Blueprint
chatBot = Blueprint('chatBot', __name__)

@chatBot.route('/chat2', methods=['POST'])
def process_question():
    try:
        data = request.get_json()
        question = data.get("question", "")
        response = get_answer(question)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

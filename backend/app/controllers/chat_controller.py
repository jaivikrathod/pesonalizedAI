from flask import Blueprint, request, jsonify
from flask_socketio import emit
from sentence_transformers import SentenceTransformer, util
import torch
from app.models.qa_model import load_dataset
from app import socketio


chat_routes = Blueprint("chat", __name__)


model = SentenceTransformer("all-MiniLM-L6-v2")

qa_data = load_dataset()
embeddings = []
question_groups = []
selectedCategory = ""

subEmbeddings = []
subQuestion_groups = []


def prepare_embeddings():
    global embeddings, question_groups
    for pair in qa_data:
        if pair["QA"]["isDefault"]:
            question = pair["QA"]["question"]
            paraphrases = pair["QA"]["paraphrases"]
            all_related = [question] + paraphrases
            embeddings.append(model.encode(all_related, convert_to_tensor=True))
            question_groups.append(
                {
                    "main_question": question,
                    "answer": pair["QA"]["answer"],
                    "all_related": all_related,
                    "media": pair["media"],
                    "category": pair["QA"]["category"],
                }
            )


def prepare_subEmbeddings():
    global subEmbeddings, subQuestion_groups
    for pair in qa_data:
        if pair.get("QA", {}).get("category") == selectedCategory:
            question = pair["QA"]["question"]
            paraphrases = pair["QA"]["paraphrases"]
            all_related = [question] + paraphrases
            subEmbeddings.append(model.encode(all_related, convert_to_tensor=True))
            subQuestion_groups.append(
                {
                    "main_question": question,
                    "answer": pair["QA"]["answer"],
                    "all_related": all_related,
                    "media": pair["media"],
                    "category": pair["QA"]["category"],
                }
            )


def get_answer(customer_question, threshold=0.4):
    global selectedCategory, selected_question_group, selected_group_embeddings
    second_term = True

    while True:

        print("Received question:", customer_question)

        if not customer_question.strip():
            return {
                "message": "I'm sorry, I didn't understand your question. Please try again."
            }

        customer_embedding = model.encode(customer_question, convert_to_tensor=True)

        best_match = None
        best_score = -1

        if not subEmbeddings and not subQuestion_groups:
            selected_question_group = question_groups
            selected_group_embeddings = embeddings
        else:
            selected_question_group = subQuestion_groups
            selected_group_embeddings = subEmbeddings

        for group, group_embeddings in zip(
            selected_question_group, selected_group_embeddings
        ):
            scores = util.cos_sim(customer_embedding, group_embeddings).squeeze(0)
            top_score, top_idx = torch.max(scores, dim=0)

            if top_score.item() > best_score and top_score.item() >= threshold:
                best_match = {
                    "main_question": group["main_question"],
                    "answer": group["answer"],
                    "matched_question": group["all_related"][top_idx.item()],
                    "media": group["media"],
                    "score": top_score.item(),
                    "category": group["category"],
                }
                best_score = top_score.item()

        if best_match:
            print("Best match:", best_match)
            response = {
                "matched_question": best_match["matched_question"],
                "answer": best_match["answer"],
                "score": best_match["score"],
            }

            if "media" in best_match:
                response["media"] = [
                    f"http://127.0.0.1:5000/media/{filename}"
                    for filename in best_match["media"]
                ]

            selectedCategory = best_match["category"]
            prepare_subEmbeddings()
            return response

        if second_term:
            print("No suitable answer found.")
            clearAdditionals()
            prepare_embeddings()
            second_term = False
        else:
            break

    return {
        "message": "I'm sorry, I couldn't find a suitable answer. Could you rephrase your question?"
    }


prepare_embeddings()


def clearAdditionals():
    global selectedCategory, subEmbeddings, subQuestion_groups

    selectedCategory = ""
    subEmbeddings = []
    subQuestion_groups = []

@socketio.on("chat_message")
def handle_chat_message(data):
    try:
        print("Chat function called, received:", data)
        question = data.get("question", "")

        response = get_answer(question)
        print("Chat response:", response)

        emit("chat_response", response)

    except Exception as e:
        print("Chat error:", str(e))
        emit("chat_response", {"error": str(e)})

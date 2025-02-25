# from flask import Blueprint, request, jsonify
# from sentence_transformers import SentenceTransformer, util
# import torch
# from app.models.qa_model import load_dataset

# # Load pre-trained model
# model = SentenceTransformer('all-MiniLM-L6-v2')

# # Prepare dataset and embeddings
# qa_data = load_dataset()
# embeddings = []
# question_groups = []

# def prepare_embeddings():
#     global embeddings, question_groups
#     print("qa_data",qa_data)
#     for pair in qa_data:
#      if(pair["QA"]["isDefault"]):
#         question = pair["QA"]["question"]
#         print("question",question)
#         paraphrases = pair["QA"]["paraphrases"]
#         print("para",paraphrases)
#         all_related = [question] + paraphrases
#         print("all re",all_related)
#         embeddings.append(model.encode(all_related, convert_to_tensor=True))
#         question_groups.append({
#             "main_question": question,
#             "answer": pair["QA"]["answer"],
#             "all_related": all_related
#         })
#         print(question_groups)


# def get_answer(customer_question, threshold=0.4):
#     if not customer_question.strip():
#         return "I'm sorry, I didn't understand your question. Please try again."

#     customer_embedding = model.encode(customer_question, convert_to_tensor=True)
#     best_match = None
#     best_score = -1

#     for group, group_embeddings in zip(question_groups, embeddings):
#         scores = util.cos_sim(customer_embedding, group_embeddings).squeeze(0)
#         top_score, top_idx = torch.max(scores, dim=0)

#         if top_score.item() > best_score and top_score.item() >= threshold:
#             best_match = {
#                 "main_question": group["main_question"],
#                 "answer": group["answer"],
#                 "matched_question": group["all_related"][top_idx.item()],
#                 "score": top_score.item()
#             }
#             best_score = top_score.item()

#     if best_match:
#         return {
#             "matched_question": best_match['matched_question'],
#             "answer": best_match['answer'],
#             "score": best_match['score']
#         }

#     return {"message": "I'm sorry, I couldn't find a suitable answer. Could you rephrase your question?"}

# # Define Blueprint
# chatBot = Blueprint('chatBot', __name__)

# @chatBot.route('/chat2', methods=['POST'])
# def process_question():
#     try:
#         prepare_embeddings()
#         data = request.get_json()
#         print(data)
#         question = data.get("question", "")
#         response = get_answer(question)
#         return jsonify(response), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500



from flask import Blueprint, request, jsonify
from flask_socketio import emit
from sentence_transformers import SentenceTransformer, util
import torch
from app.models.qa_model import load_dataset
from app import socketio  # Importing socketio


# Define blueprint
chat_routes = Blueprint("chat", __name__)

# Load pre-trained model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Prepare dataset and embeddings
qa_data = load_dataset()
embeddings = []
question_groups = []

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
            question_groups.append({
                "main_question": question,
                "answer": pair["QA"]["answer"],
                "all_related": all_related,
                "media": pair["media"]
            })

def prepare_subEmbeddings():
    global subEmbeddings, subQuestion_groups
    for pair in qa_data:
        if pair["QA"]["isDefault"]:
            question = pair["QA"]["question"]
            paraphrases = pair["QA"]["paraphrases"]
            all_related = [question] + paraphrases
            subEmbeddings.append(model.encode(all_related, convert_to_tensor=True))
            question_groups.append({
                "main_question": question,
                "answer": pair["QA"]["answer"],
                "all_related": all_related,
                "media": pair["media"]
            })
    

def get_answer(customer_question, threshold=0.4):
    print("Received question:", customer_question)  # Debugging print

    if not customer_question.strip():
        return {"message": "I'm sorry, I didn't understand your question. Please try again."}

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
                "media": group["media"],
                "score": top_score.item()
            }
            best_score = top_score.item()

    if best_match:
        print("Best match:", best_match)  # Debugging print
        response = {
            "matched_question": best_match['matched_question'],
            "answer": best_match['answer'],
            "score": best_match['score'],
        }
        
        if "media" in best_match:
         response["media"] = [f"http://127.0.0.1:5000/media/{filename}" for filename in best_match["media"]]
         return response

    print("No suitable answer found.") 
    return {"message": "I'm sorry, I couldn't find a suitable answer. Could you rephrase your question?"}

prepare_embeddings()

@socketio.on("chat_message")  
def handle_chat_message(data):
    try:
        print("Chat function called, received:", data)
        question = data.get("question", "")

        response = get_answer(question)
        print("Chat response:", response)  # Debugging print

        emit("chat_response", response)
    
    except Exception as e:
        print("Chat error:", str(e))  # Debugging print
        emit("chat_response", {"error": str(e)})




# from flask import Blueprint, request, jsonify
# from sentence_transformers import SentenceTransformer, util
# import torch
# from app.models.qa_model import load_dataset

# # Load pre-trained model
# model = SentenceTransformer('all-MiniLM-L6-v2')

# # Prepare dataset and embeddings
# qa_data = load_dataset()
# embeddings = []
# question_groups = []
# sub_question_map = {}  # Mapping of main questions to subQuestions

# def prepare_embeddings():
#     global embeddings, question_groups, sub_question_map
#     embeddings.clear()
#     question_groups.clear()
#     sub_question_map.clear()

#     for pair in qa_data:
#         qa = pair["QA"]

#         # Only process if isDefault is True
#         if qa.get("isDefault", False):
#             question = qa["question"]
#             paraphrases = qa["paraphrases"]
#             sub_questions = qa.get("subQuestions", [])

#             all_related = [question] + paraphrases
#             embeddings.append(model.encode(all_related, convert_to_tensor=True))
            
#             question_groups.append({
#                 "main_question": question,
#                 "answer": qa["answer"],
#                 "all_related": all_related
#             })

#             # Store subQuestions for later lookup
#             if sub_questions:
#                 sub_question_map[question] = sub_questions

# def get_answer(customer_question, previous_question=None, threshold=0.2):
#     if not customer_question.strip():
#         return "I'm sorry, I didn't understand your question. Please try again."

#     customer_embedding = model.encode(customer_question, convert_to_tensor=True)

#     # 1️⃣ Check subQuestions first if there was a previous main question
#     if previous_question and previous_question in sub_question_map:
#         for sub_question in sub_question_map[previous_question]:
#             if util.cos_sim(customer_embedding, model.encode(sub_question, convert_to_tensor=True)).item() >= threshold:
#                 return {
#                     "matched_question": sub_question,
#                     "answer": f"This is related to your previous question: {previous_question}.",
#                     "score": 1.0
#                 }

#     # 2️⃣ If no subQuestion match, proceed with normal search
#     best_match = None
#     best_score = -1

#     for group, group_embeddings in zip(question_groups, embeddings):
#         scores = util.cos_sim(customer_embedding, group_embeddings).squeeze(0)
#         top_score, top_idx = torch.max(scores, dim=0)

#         if top_score.item() > best_score and top_score.item() >= threshold:
#             best_match = {
#                 "main_question": group["main_question"],
#                 "answer": group["answer"],
#                 "matched_question": group["all_related"][top_idx.item()],
#                 "score": top_score.item()
#             }
#             best_score = top_score.item()

#     if best_match:
#         return {
#             "matched_question": best_match['matched_question'],
#             "answer": best_match['answer'],
#             "score": best_match['score']
#         }

#     return {"message": "I'm sorry, I couldn't find a suitable answer. Could you rephrase your question?"}

# # Define Blueprint
# chatBot = Blueprint('chatBot', __name__)

# @chatBot.route('/chat2', methods=['POST'])
# def process_question():
#     try:
#         prepare_embeddings()
#         data = request.get_json()
#         print(data)

#         question = data.get("question", "")
#         previous_question = data.get("previous_question", None)  # Pass previous question if available

#         response = get_answer(question, previous_question)
#         return jsonify(response), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

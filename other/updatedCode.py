from sentence_transformers import SentenceTransformer, util
import torch
from pymongo import MongoClient


def load_dataset_from_db(db_url, db_name, collection_name):
    """
    Load the QA dataset from a MongoDB collection.
    """
    client = MongoClient(db_url)
    db = client[db_name]
    collection = db[collection_name]
    
    # Fetch all documents from the collection
    data = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB's ObjectId field
    client.close()
    return data


def prepare_embeddings(qa_pairs, model):
    """
    Prepare embeddings for main questions and their paraphrases.
    """
    embeddings = []
    question_groups = []

    for pair in qa_pairs:
        question = pair["question"]
        paraphrases = pair.get("paraphrases", [])

        # Embed the main question and its paraphrases
        all_related = [question] + paraphrases
        embeddings.append(model.encode(all_related, convert_to_tensor=True))
        question_groups.append({
            "main_question": question,
            "answer": pair["answer"],
            "all_related": all_related
        })

    return embeddings, question_groups


def get_answer(customer_question, embeddings, question_groups, model, threshold=0.5):
    """
    Find the most relevant answer to the customer's question.
    """
    if not customer_question.strip():
        return "I'm sorry, I didn't understand your question. Please try again."

    # Embed the customer's question
    customer_embedding = model.encode(customer_question, convert_to_tensor=True)

    # Compare against each group of questions
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
        return (f"Matched Question: {best_match['matched_question']}\n"
                f"Answer: {best_match['answer']} (Score: {best_match['score']:.2f})")

    return "I'm sorry, I couldn't find a suitable answer. Could you rephrase your question?"


def main():
    # MongoDB configuration
    db_url = "mongodb://localhost:27017/"  # Replace with your MongoDB connection string
    db_name = "PersonalizedAI"  # Replace with your database name
    collection_name = "QA"  # Replace with your collection name

    # Load the dataset from MongoDB
    qa_pairs = load_dataset_from_db(db_url, db_name, collection_name)

    # Load the pre-trained model
    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Prepare embeddings and question groups
    embeddings, question_groups = prepare_embeddings(qa_pairs, model)

    # Q&A loop
    print("Welcome to the Q&A System. Type 'exit' to quit.")
    while True:
        customer_question = input("\nAsk a question: ")
        if customer_question.lower() == "exit":
            print("Exiting the Q&A system. Goodbye!")
            break
        response = get_answer(customer_question, embeddings, question_groups, model)
        print(f"AI Response:\n{response}")


if __name__ == "__main__":
    main()

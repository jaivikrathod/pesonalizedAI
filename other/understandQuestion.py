# from sentence_transformers import SentenceTransformer, util
# import json
# import torch

# def load_dataset(file_path):
#     """
#     Load the QA dataset from a JSON file.
#     """
#     with open(file_path, "r") as f:
#         return json.load(f)

# def prepare_embeddings(qa_pairs, model):
#     """
#     Prepare embeddings for main questions and paraphrases.
#     """
#     questions = []
#     answers = []
#     all_paraphrases = []

#     for pair in qa_pairs:
#         main_question = pair["question"]
#         paraphrases = pair.get("paraphrases", [])
        
#         questions.append(main_question)
#         answers.append(pair["answer"])
        
#         # Combine main question and paraphrases
#         all_paraphrases.append(main_question)
#         all_paraphrases.extend(paraphrases)
    
#     # Compute embeddings for all questions and paraphrases
#     embeddings = model.encode(all_paraphrases, convert_to_tensor=True)
#     return questions, answers, embeddings, all_paraphrases

# def get_top_answers(customer_question, all_paraphrases, answers, paraphrase_embeddings, model, top_k=2, threshold=0.5):
#     """
#     Retrieve the top matching answers for the customer's question.
#     """
#     if not customer_question.strip():
#         return "I'm sorry, I didn't understand your question. Please try again."
    
#     # Compute embedding for the customer question
#     customer_embedding = model.encode(customer_question, convert_to_tensor=True)
    
#     # Compute similarity scores
#     scores = util.cos_sim(customer_embedding, paraphrase_embeddings)
#     top_results = scores.topk(k=top_k)
#     top_indices = top_results.indices[0].tolist()
#     top_scores = top_results.values[0].tolist()
    
#     # Filter by threshold
#     top_matches = [(idx, score) for idx, score in zip(top_indices, top_scores) if score >= threshold]
#     if not top_matches:
#         return "I'm sorry, I couldn't find a suitable answer. Could you rephrase your question?"

#     # Prepare response
#     response = "Here are the closest matches:\n"
#     seen_answers = set()
#     for i, (idx, score) in enumerate(top_matches):
#         main_answer_idx = idx % len(answers)  # Map paraphrases to main answers
#         if main_answer_idx not in seen_answers:
#             response += f"{i + 1}. {all_paraphrases[idx]} → {answers[main_answer_idx]} (Score: {score:.2f})\n"
#             seen_answers.add(main_answer_idx)
    
#     return response

# def main():
#     # Load the dataset
#     file_path = "question.json"  # Path to JSON file
#     qa_pairs = load_dataset(file_path)
    
#     # Load the pre-trained model
#     model = SentenceTransformer('all-MiniLM-L6-v2')
    
#     # Prepare embeddings
#     questions, answers, paraphrase_embeddings, all_paraphrases = prepare_embeddings(qa_pairs, model)
    
#     # Q&A loop
#     print("Welcome to the Q&A System. Type 'exit' to quit.")
#     while True:
#         customer_question = input("\nAsk a question: ")
#         if customer_question.lower() == "exit":
#             print("Exiting the Q&A system. Goodbye!")
#             break
#         response = get_top_answers(customer_question, all_paraphrases, answers, paraphrase_embeddings, model)
#         print(f"AI Response:\n{response}")

# if __name__ == "__main__":
#     main()



from sentence_transformers import SentenceTransformer, util
import json
import torch


def load_dataset(file_path):
    """
    Load the QA dataset from a JSON file.
    """
    with open(file_path, "r") as f:
        return json.load(f)


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
    # Load the dataset
    file_path = "qa_dataset.json"  # Path to JSON file
    qa_pairs = load_dataset(file_path)

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

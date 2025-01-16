from pymongo import MongoClient
from app.config import db_url, db_name, collection_name

# Initialize the MongoDB client and collection
client = MongoClient(db_url)
db = client[db_name]
collection = db[collection_name]

# Function to insert QA data
def insert_qa_data(userid, question, answer, paraphrases):
    data = {
        "userid": userid,
        "QA": {
            "question": question,
            "answer": answer,
            "paraphrases": paraphrases
        }
    }
    
    # Insert data into MongoDB
    result = collection.insert_one(data)
    return result.inserted_id

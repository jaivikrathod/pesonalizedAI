from pymongo import MongoClient
from app.config import db_url, db_name, collection_name

# Initialize the MongoDB client and collection
client = MongoClient(db_url)
db = client[db_name]
collection = db[collection_name]

# Function to insert QA data
def insert_qa_data(userid, question, answer, paraphrases):
    try:
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
    except Exception as e:
        raise Exception(f"Error inserting QA data: {str(e)}")


def load_dataset():
    """
    Load the QA dataset from the database.
    """
    return list(collection.find({}, {"_id": 0}))
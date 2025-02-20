from pymongo import MongoClient
from app.config import db_url, db_name

client = MongoClient(db_url)
db = client[db_name]
collection = db['QA']

def insert_qa_data(userid,QA,filaNames):
    try:
        data = {
            "userid": userid,
            "QA":QA,
            "media":filaNames,
        }
        result = collection.insert_one(data)
        return result.inserted_id
    except Exception as e:
        raise Exception(f"Error inserting QA data: {str(e)}")


def load_dataset():
    return list(collection.find({}, {"_id": 0}))
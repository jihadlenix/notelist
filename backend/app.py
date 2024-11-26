from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")

# Test MongoDB connection
try:
    client = MongoClient(MONGO_URI)
    db = client.get_database()  # Try getting the default database
    print(f"Successfully connected to MongoDB database: {db.name}")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    exit(1)  # Exit if MongoDB connection fails

# Create or get the 'notes' collection
notes_collection = db["notes"]  # Use or create the "notes" collection

# Routes

@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Notepad API!"})

# Create a new note
@app.route("/notes", methods=["POST"])
def create_note():
    print(request.json)
    data = request.get_json()
    title = data.get("title")
    content = data.get("content")

    if not title or not content:
        return jsonify({"error": "Both title and content are required"}), 400

    if notes_collection.find_one({"title": title}):
        return jsonify({"error": "Note with this title already exists"}), 409

    note = {"title": title, "content": content}
    notes_collection.insert_one(note)
    return jsonify({"message": "Note created successfully!"}), 201

# Get all notes
@app.route("/notes", methods=["GET"])
def get_notes():
    notes = list(notes_collection.find({}, {"_id": 0}))  # Exclude _id from results
    return jsonify(notes)

# Update a note
@app.route("/notes/<string:title>", methods=["PUT"])
def update_note(title):
    data = request.get_json()
    new_content = data.get("content")

    if not new_content:
        return jsonify({"error": "Content is required"}), 400

    result = notes_collection.update_one({"title": title}, {"$set": {"content": new_content}})
    if result.matched_count == 0:
        return jsonify({"error": "Note not found"}), 404

    return jsonify({"message": "Note updated successfully!"})

# Delete a note
@app.route("/notes/<string:title>", methods=["DELETE"])
def delete_note(title):
    result = notes_collection.delete_one({"title": title})
    if result.deleted_count == 0:
        return jsonify({"error": "Note not found"}), 404

    return jsonify({"message": "Note deleted successfully!"})

# Error handling
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Route not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "An internal error occurred"}), 500

# Run the app
if __name__ == "__main__":
    app.run(debug=True)

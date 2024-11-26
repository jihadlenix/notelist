import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotesList.css';  // Import the component-specific styles

const NotesList = () => {
  const [notes, setNotes] = useState([]); // State for storing notes
  const [title, setTitle] = useState(''); // State for the note title input
  const [content, setContent] = useState(''); // State for the note content input

  useEffect(() => {
    // Fetch the notes from the backend when the component mounts
    axios.get('http://127.0.0.1:5000/notes')
      .then(response => {
        setNotes(response.data); // Store the notes in the state
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
      });
  }, []);

  const handleSaveNote = () => {
    if (!title || !content) {
      alert('Both title and content are required.');
      return;
    }

    // Send POST request to create a new note
    axios.post('http://127.0.0.1:5000/notes', { title, content })
      .then(response => {
        console.log('Note saved successfully:', response);
        setNotes([...notes, { title, content }]); // Update the notes state
        setTitle(''); // Clear the title input
        setContent(''); // Clear the content input
      })
      .catch(error => {
        console.error('Error saving note:', error);
      });
  };

  const handleDeleteNote = (title) => {
    // Send DELETE request to delete the note by title
    axios.delete(`http://127.0.0.1:5000/notes/${title}`)
      .then(response => {
        console.log('Note deleted successfully:', response);
        setNotes(notes.filter(note => note.title !== title)); // Remove deleted note from state
      })
      .catch(error => {
        console.error('Error deleting note:', error);
      });
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Saved Notes</h3>
        <div id="savedNotes">
          {notes.length === 0 ? (
            <p>No notes available</p>
          ) : (
            notes.map(note => (
              <div key={note.title} className="note">
                <h4>{note.title}</h4>
                <button className="deleteBtn" onClick={() => handleDeleteNote(note.title)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Note Editor */}
      <div className="note-editor">
        <input
          type="text"
          id="noteTitle"
          placeholder="Enter title"
          value={title} // Bind input to state
          onChange={(e) => setTitle(e.target.value)} // Update state on change
        />
        <textarea
          id="noteContent"
          placeholder="Enter note content"
          value={content} // Bind textarea to state
          onChange={(e) => setContent(e.target.value)} // Update state on change
        />
        <button className="save-btn" onClick={handleSaveNote}>
          Save
        </button>
        <button
          className="clear-btn"
          onClick={() => {
            setTitle(''); // Clear title
            setContent(''); // Clear content
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default NotesList;

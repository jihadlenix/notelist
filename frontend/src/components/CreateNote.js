import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleCreateNote = () => {
    console.log('Save button clicked!');
    console.log('Title:', title, 'Content:', content);  // Check if title and content are correct
    axios.post('http://127.0.0.1:5000/notes', { title, content })
      .then(response => {
        console.log('Note created:', response);  // Check response from backend
        navigate('/');
      })
      .catch(error => {
        console.error('Error creating note:', error);  // Log any error in the request
      });
  };
  return (
    <div className="note-editor">
      <input
        id="noteTitle"
        type="text"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        id="noteContent"
        placeholder="Note Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button  type="button" className="save-btn" onClick={handleCreateNote}>
        Save Note
      </button>
      <button className="clear-btn" onClick={() => { setTitle(''); setContent(''); }}>
        Clear
      </button>
    </div>
  );
};

export default CreateNote;

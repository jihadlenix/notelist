import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditNote = () => {
  const { title } = useParams();
  const [newContent, setNewContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the existing note content from the backend
    axios.get(`http://localhost:5000/notes/${title}`)
      .then(response => {
        setNewContent(response.data.content);  // Set the existing content for editing
      })
      .catch(error => {
        console.error('Error fetching note:', error);
      });
  }, [title]);

  const handleEditNote = () => {
    // Send the updated content to the backend using PUT request
    axios.put(`http://localhost:5000/notes/${title}`, { content: newContent })
      .then(response => {
        console.log('Note updated successfully:', response);
        navigate('/');
      })
      .catch(error => {
        console.error('Error updating note:', error);
      });
  };

  return (
    <div className="note-editor">
      <textarea
        id="noteContent"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
      />
      <button className="save-btn" onClick={handleEditNote}>
        Save Changes
      </button>
    </div>
  );
};

export default EditNote;

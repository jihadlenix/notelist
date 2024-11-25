import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotesList from './components/NotesList';
import CreateNote from './components/CreateNote';
import EditNote from './components/EditNote';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NotesList />} />
        <Route path="/create" element={<CreateNote />} />
        <Route path="/edit/:title" element={<EditNote />} />
      </Routes>
    </Router>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_URL = "http://localhost:5000";

function App() {
  const [noteList, setNoteList] = useState([]);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await axios.get(`${API_URL}/notes`);
        const fetchedNotes = res.data.map((note) => ({
          id: note.id,
          title: note.title,
          content: note.content,
        }));
        setNoteList(fetchedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error.message);
      }
    }

    fetchNotes();
  }, []);

  async function addNote(note) {
    try {
      const res = await axios.post(`${API_URL}/notes`, note);
      setNoteList((prevList) => [...prevList, { ...note, id: res.data.id }]);
    } catch (error) {
      console.error("Error adding note:", error.message);
    }
  }

  async function deleteNote(id) {
    try {
      const res = await axios.delete(`${API_URL}/notes/${id}`);
      console.log("Server response:", res.data); // Ensure the response is logged after awaiting
      setNoteList((prevList) => prevList.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error.message);
    }
  }

  async function editNote(id, updatedNote) {
    try {
      const res = await axios.patch(`${API_URL}/notes/${id}`, updatedNote);
      console.log("Server response:", res.data); // Ensure the response is logged after awaiting
      const updatedNoteList = noteList.map((oldNote) =>
        oldNote.id === id ? { ...oldNote, ...updatedNote } : oldNote
      );
      setNoteList(updatedNoteList);
    } catch (error) {
      console.error("Error editing note:", error.message);
      alert("Error updating: " + id, error.message);
    }
  }

  return (
    <div>
      <Header />
      <CreateArea addNote={addNote} />
      {noteList.map((note) => {
        const key = uuidv4();

        return (
          <Note
            key={key}
            id={note.id}
            title={note.title}
            content={note.content}
            onDelete={deleteNote}
            onEdit={editNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;

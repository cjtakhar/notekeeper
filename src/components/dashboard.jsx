import React, { useState } from "react";

const API_URL = "http://localhost:5109/api/notes"; // Adjust based on your backend URL

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [newNoteSummary, setNewNoteSummary] = useState("");
  const [newNoteDetails, setNewNoteDetails] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [editingSummary, setEditingSummary] = useState("");
  const [editingDetails, setEditingDetails] = useState("");

  const fetchNotes = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addNote = async () => {
    if (!newNoteSummary || !newNoteDetails) return;
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: newNoteSummary, details: newNoteDetails })
      });
      if (response.ok) {
        setNewNoteSummary("");
        setNewNoteDetails("");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const updateNote = async () => {
    if (!editingNote || (!editingSummary && !editingDetails)) return;
    try {
      await fetch(`${API_URL}/${editingNote}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: editingSummary, details: editingDetails })
      });
      setEditingNote(null);
      setEditingSummary("");
      setEditingDetails("");
      fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Note Keeper</h1>
      <button onClick={fetchNotes}>Fetch Notes</button>
      <button onClick={addNote}>Add Note</button>
      <div>
        <input
          type="text"
          placeholder="Enter note summary"
          value={newNoteSummary}
          onChange={(e) => setNewNoteSummary(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter note details"
          value={newNoteDetails}
          onChange={(e) => setNewNoteDetails(e.target.value)}
        />
      </div>
      <ul>
        {notes.map((note) => (
          <li key={note.noteId}>
            {editingNote === note.noteId ? (
              <>
                <input
                  type="text"
                  placeholder="Edit summary"
                  value={editingSummary}
                  onChange={(e) => setEditingSummary(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Edit details"
                  value={editingDetails}
                  onChange={(e) => setEditingDetails(e.target.value)}
                />
                <button onClick={updateNote}>Save</button>
              </>
            ) : (
              <>
                <strong>{note.summary}</strong>: {note.details}
                <button onClick={() => {
                  setEditingNote(note.noteId);
                  setEditingSummary(note.summary);
                  setEditingDetails(note.details);
                }}>Edit</button>
                <button onClick={() => deleteNote(note.noteId)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;

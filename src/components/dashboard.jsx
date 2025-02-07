import React, { useState } from "react";
import "./dashboard.css";

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
        fetchNotes(); // Refresh the list
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const deleteNote = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

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
    <div className="dashboard">
      <div className="title-container">
        <h1 className="title">Note Keeper</h1>
      </div>

      {/* Input for New Note */}
      <div className="input-container">
        <input
          className="input-title"
          type="text"
          placeholder="Title"
          value={newNoteSummary}
          onChange={(e) => setNewNoteSummary(e.target.value)}
        />
        <textarea
          className="input-details"
          placeholder="Note"
          value={newNoteDetails}
          onChange={(e) => setNewNoteDetails(e.target.value)}
        />
        <div className="button-container">
          <button onClick={addNote}>+</button>
          <button className="btn-fetch" onClick={fetchNotes}>Get Notes</button>
        </div>
      </div>

      {/* Display Notes */}
      <div className="notes-container">
        {notes.map((note) => (
          <div key={note.noteId} className="note-card">
            {editingNote === note.noteId ? (
              <>
                {/* Edit Mode */}
                <input
                  className="edit-title"
                  type="text"
                  value={editingSummary}
                  onChange={(e) => setEditingSummary(e.target.value)}
                />
                <textarea
                  className="edit-details"
                  value={editingDetails}
                  onChange={(e) => setEditingDetails(e.target.value)}
                />
                <button className="btn-save" onClick={updateNote}>Save</button>
                <button className="btn-cancel" onClick={() => setEditingNote(null)}>Cancel</button>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div className="note-title">{note.summary}</div>
                <div className="note-details">{note.details}</div>
                <div className="note-actions">
                  <div className="edit-delete-container">
                    <button className="btn-edit" onClick={() => {
                      setEditingNote(note.noteId);
                      setEditingSummary(note.summary);
                      setEditingDetails(note.details);
                    }}>Edit</button>
                    <button className="btn-delete" onClick={() => deleteNote(note.noteId)}>Delete</button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

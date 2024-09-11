import React, { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function Note(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(props.title);
  const [editedContent, setEditedContent] = useState(props.content);

  function handleEditClick() {
    setIsEditing(true);
  }

  function handleCancelClick() {
    setIsEditing(false);
    setEditedTitle(props.title);
    setEditedContent(props.content);
  }

  function handleSaveClick() {
    const updatedNote = {
      title: editedTitle,
      content: editedContent,
    };
  
    props.onEdit(props.id, updatedNote);
    setIsEditing(false);
  }

  return (
    <div className="note">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows="3"
          />
          <button onClick={handleCancelClick}><CancelIcon /></button>
          <button onClick={handleSaveClick}><SaveIcon /></button>
        </>
      ) : (
        <>
          <h1>{props.title}</h1>
          <p>{props.content}</p>
          <button onClick={() => props.onDelete(props.id)}><DeleteIcon /></button>
          <button onClick={handleEditClick}><EditIcon /></button>
        </>
      )}
    </div>
  );
}

export default Note;

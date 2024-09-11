import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";
import Grow from "@mui/material/Grow";

function CreateArea(props) {
  const [note, setNote] = React.useState({ title: "", content: "" });
  const [expanded, setExpanded] = React.useState(false);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setNote((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const updatedNote = {
      title: note.title || "Title",
      content: note.content || "Note content",
    };
    props.addNote(updatedNote);
    setNote({ title: "", content: "" });
  }

  function handleExpand() {
    setExpanded((prev) => !prev);
  }

  return (
    <div>
      <form className="create-note" onSubmit={handleSubmit}>
        {expanded && (
          <Grow in={expanded ? true : false}>
            <input
              name="title"
              placeholder="Title"
              value={note.title}
              onChange={handleOnChange}
            />
          </Grow>
        )}
        <textarea
          onClick={handleExpand}
          name="content"
          placeholder="Take a note..."
          rows={expanded ? 3 : 1}
          value={note.content}
          onChange={handleOnChange}
        />

        <Zoom in={expanded ? true : false}>
          <Fab type="submit" size="medium" aria-label="add">
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import morgan from "morgan";

const app = express();
const port = 5000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "notes",
  password: "211102",
  port: 5432,
});
db.connect();

app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("combined"));
let notesList = [];

async function getNotes() {
  const result = await db.query("SELECT * FROM notes");
  notesList = result.rows;
}

app.get("/notes", async (req, res) => {
  await getNotes();
  res.json(notesList);
});

app.post("/notes", async (req, res) => {
  const newNote = {
    title: req.body.title,
    content: req.body.content,
  };
  console.log(newNote);
  
  db.query("INSERT INTO notes (title, content) VALUES ($1, $2)", [newNote.title, newNote.content]);
  res.status(201).json(newNote) // 201 meaning sth created;
});

app.patch("/notes/:id", async (req, res) => {
  await getNotes();
  const index = parseInt(req.params.id);
  const existingNote = notesList.find((note) => note.id === index);
  if (!existingNote) return res.status(404).json({ message: "Note not found" });
  
  const updatedNote = {
    id: index,
    title: req.body.title || existingNote.title,
    content: req.body.content || existingNote.content,
  };
  db.query("UPDATE notes SET title=$1, content=$2 WHERE id=$3", [
    updatedNote.title,
    updatedNote.content,
    index,
  ]);
  res.json(updatedNote);
});

app.delete("/notes/:id", async (req, res) => {
  try {
    // Fetch notes list (assuming this is necessary and getNotes() is defined elsewhere)
    await getNotes();

    // Find the index of the note with the given id
    const noteId = parseInt(req.params.id);
    const index = notesList.findIndex((p) => p.id === noteId);

    if (index === -1) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Delete the note from the database
    await db.query('DELETE FROM notes WHERE id=$1', [noteId]);

    // Send a success response
    res.json({ message: `Note deleted for id: ${noteId}` });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});

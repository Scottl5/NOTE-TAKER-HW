const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("./helpers/uuid");
const { readFromFile, readAndAppend } = require("./helpers/fsUtils");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
  console.log(`${req.method} request received`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    readAndAppend(newNote, "./db/db.json");
    res.json("New note was appended");
  } else {
    res.error("error with adding note");
  }
});
app.listen(PORT, () => {
  console.log(`Listenting at http://localhost:${PORT}`);
});

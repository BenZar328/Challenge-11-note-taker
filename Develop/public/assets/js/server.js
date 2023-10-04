const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.get('/api/notes', (req, res) => {
  fs.readFile('notes.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile('notes.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const notes = JSON.parse(data);

    const newNote = {
      id: Date.now(),
      title: req.body.title || 'Untitled',
      text: req.body.text || '',
    };
    notes.push(newNote);
    fs.writeFile('notes.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  
  fs.readFile('notes.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    let notes = JSON.parse(data);

    const noteIndex = notes.findIndex((note) => note.id === Number(noteId));

    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }

    notes.splice(noteIndex, 1);

    fs.writeFile('notes.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.status(204).end(); 
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

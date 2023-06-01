const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const port = 3000;
app.listen(port, () => {
    console.log('server starter')
});
const dataPath = path.join(__dirname, 'db', 'db.json');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
    const data = readData();
    res.json(data);
})

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    const data = readData();

    const newItem= {
        id: Date.now(),
        title,
        text
    };
    data.push(newItem);
    writeData(data);
    res.redirect('/');
})

app.delete('/api/notes/:id', (req,res) =>{
    const {id}= req.params;
    const data = readData();
    const idx= data.findIndex(note => note.id==id);
    if (idx ==-1) {
        return res.status(404).json({error: 'note not found'});
    }
    const deletedNote = data.splice(idx,1);
    writeData(data);
    res.json ({message: 'note deleted successfully', note: deletedNote});
})


function readData() {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
}

function writeData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}
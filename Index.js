const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(express.json());


let library = [
    {
        "id": 1,
        "title": "Atomic Habits",
        "author": "James Clear",
        "category": "Self-Help"
    }
];


app.get(['/', '/home'], (req, res) => {
    fs.readFile(path.join(__dirname, 'home.html'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error loading Home page');
        }
        res.send(data);
    });
});


app.get('/api/books', (req, res) => {
    res.status(200).json(library);
});

app.post('/api/books', (req, res) => {
    const { title, author, category } = req.body;
    
    const newBook = {
        "id": library.length > 0 ? library[library.length - 1].id + 1 : 1, 
        "title": title,
        "author": author,
        "category": category
    };
    
    library.push(newBook);
    res.status(201).json({ message: "Book added successfully!", book: newBook });
});


app.put('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const { title, author, category } = req.body;
    
    let book = library.find(b => b.id === bookId);
    
    if (book) {
        if (title) book.title = title;
        if (author) book.author = author;
        if (category) book.category = category;
        res.status(200).json({ message: "Book updated!", book: book });
    } else {
        res.status(404).json({ message: "Book not found!" });
    }
});

app.delete('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    library = library.filter(b => b.id !== bookId);
    
    res.status(200).json({ message: `Book with ID ${bookId} deleted.` });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
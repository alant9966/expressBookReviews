const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username is provided in the request body
    if (req.body.username && req.body.password) {
        // Check if the username already exists
        if (users.some(user => user.username === username)) {
            res.status(403).send({message: "Account with this username already exists"});
        } else {
            // Register the new user
            users.push({ username, password });

            // Send response indicating user addition
            res.send("The user" + (' ') + (username) + " has been added!");
        }
    } else {
        res.status(403).send({message: "Username or password not provided"});
    }
});

// Get the book list available in the shop
// public_users.get('/', function(req, res) {
//     // Send JSON response with formatted book list data
//     res.send(JSON.stringify({books}, null, 4));
// });

// Get the book list available in the shop using callbacks
public_users.get('/', async function(req, res) {
    try {
        // Simulate async-await operation
        const async_books = await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(books)
            }, 100)
        });

        res.send(JSON.stringify({async_books}, null, 4))
    } catch (error) {
        console.error('Error retrieving book list:', error);
        res.status(403).send('Failed to retrieve books');
    }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function(req, res) {
//     // Retrieve the ISBN parameter from the request URL and send the corresponding book's details
//     const isbn = req.params.isbn;
//     res.send(books[isbn]);
// });

// Get book details based on ISBN using callbacks
public_users.get('/isbn/:isbn', async function(req, res) {
    try {
        const isbn = req.params.isbn;
        // Simulate async-await operation
        const book = await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(books[isbn])
            }, 100)
        });

        res.send(book);
    } catch (error) {
        console.error('Error retrieving books by ISBN:', error);
        res.status(403).send(`Failed to retrieve book with ISBN ${isbn}`);
    }
});

// Get book details based on author
// public_users.get('/author/:author', function(req, res) {
//     // Extract the author parameter from the request URL
//     const author = req.params.author;
//     let filtered_books = [];

//     // Iterate through the array and check for author matches
//     for (let key of Object.keys(books)) {
//         if (books[key].author === author) {
//             filtered_books.push(books[key])
//         }
//     }

//     // Send the matches, or an error message if none found
//     if (filtered_books.length > 0) {
//         res.send(filtered_books);
//     } else {
//         res.status(403).send({message: "No books found by the given author"});
//     }
// });
  
// Get book details based on author using callbacks
public_users.get('/author/:author', async function(req, res) {
    try {
        // Extract the author parameter from the request URL
        const author = req.params.author;

        // Check the dictionary for author matches
        const filtered_books = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const filtered = Object.values(books).filter(book => book.author === author);
                resolve(filtered);
            })
        });

        // Send the matches, or an error message if none found
        if (filtered_books.length > 0) {
            res.send(filtered_books);
        } else {
            res.status(403).send({message: "No books found by the given author"});
        }
    } catch (error) {
        console.error('Error retrieving books by author:', error);
        res.status(403).send(`Failed to retrieve book(s) by author ${author}`);
    }
});

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     // Extract the title parameter from the request URL
//     const title = req.params.title;
//     let filtered_books = [];

//     // Iterate through the array and check for title matches
//     for (let key of Object.keys(books)) {
//         if (books[key].title === title) {
//             filtered_books.push(books[key])
//         }
//     }

//     // Send the matches, or an error message if none found
//     if (filtered_books.length > 0) {
//         res.send(filtered_books);
//     } else {
//         res.status(403).send({message: "No books found with the given title"});
//     }
// });

// Get all books based on title using callbacks
public_users.get('/title/:title', async function (req, res) {
    try {
        // Extract the title parameter from the request URL
        const title = req.params.title;

        // Check the dictionary for title matches
        const filtered_books = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const filtered = Object.values(books).filter(book => book.title === title);
                resolve(filtered);
            })
        });

        // Send the matches, or an error message if none found
        if (filtered_books.length > 0) {
            res.send(filtered_books);
        } else {
            res.status(403).send({message: "No books found with the given title"});
        }
    } catch (error) {
        console.error('Error retrieving books by title:', error);
        res.status(403).send(`Failed to retrieve book(s) titled ${title}`);
    }
});

// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;

const express = require('express');
const router = express.Router();
const Author = require('../models/author.js');
const Book = require('../models/book.js');
const mongoose = require('mongoose');

// All Authors Route
router.get('/', async ( request, response ) => {

    let searchOptions = {};

    if ( request.query.name != null && request.query.name !== '' ) {

        searchOptions.name = new RegExp( request.query.name, 'i')

    }

    try {

        const authors = await Author.find( searchOptions ) // if we pass empty object wich means we need all authors, mean search without any conditions

        response.render('authors/index.ejs', {
            authors: authors,
            searchOptions: request.query
        });

    } catch {

        response.redirect('/');

    }

	

});

// New Autrhor Route
router.get('/new', ( request, response ) => {

    response.render('authors/new', { author: new Author() });

});

// Create Author Route
router.post('/', async ( request, response ) => {

    const author = new Author({
        name: request.body.name
    });

    try {

        const newAuthor = await author.save(); // mongoose is async lybrary so we have to await

        response.redirect(`authors/${ newAuthor.id }`);

    } catch {

        response.render(`authors/new`, {
            author: author,
            errorMessage: 'Error creating Author'
        })

    }

});

router.get('/:id', async ( request, response ) => { // this route must be lower than '/new' route, otherwise server could think taht '/new' id an id, and we don't want it

    try {

        const author = await Author.findById( request.params.id );
        const books = await Book.find({ author: author.id }).limit( 6 ).exec();

        response.render('authors/show', {
            author: author,
            booksByAuthor: books
        })

    } catch{

        response.redirect('/');

    }

});

router.get('/:id/edit', async ( request, response ) => { // Edit author

    try {

        const author = await Author.findById( request.params.id );

        response.render('authors/edit', { author: author });

    } catch {

        response.redirect('/authors');

    }

});

router.put('/:id', async ( request, response ) => { // Updtae author

    let author

    try {

        author = await Author.findById( request.params.id );

        author.name = request.body.name;

        author.save();

        response.redirect(`/authors/${ author.id }`);

    } catch {

        if ( author == null ) {

            response.redirect('/')

        } else {

            response.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            })

        }

    }

});

router.delete('/:id', async ( request, response ) => { // Delete author

    let author

    try {

        author = await Author.findById( request.params.id );

        await author.remove();

        response.redirect(`/authors`);

    } catch {

        if ( author == null ) {

            response.redirect('/');

        } else {

            response.redirect(`/authors/${ author.id }`);

        }

    }

});



module.exports = router;
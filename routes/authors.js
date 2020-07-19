const express = require('express');
const router = express.Router();
const Author = require('../models/author.js')

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

        // response.redirect(`authors/${ newAuthor.id }`)
        response.redirect('authors')

    } catch {

        response.render(`authors/new`, {
            author: author,
            errorMessage: 'Error creating Author'
        })

    }

});

module.exports = router;
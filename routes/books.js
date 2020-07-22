const express = require('express');
const router = express.Router();
const Book = require('../models/book.js');
const Author = require('../models/author.js');
const { response } = require('express');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// All Books Route
router.get('/', async ( request, response ) => {

    let query = Book.find();

    if ( request.query.title != null && request.query.title != '' ) {

        query = query.regex('title', new RegExp( request.query.title, 'i' ))

    }

    if ( request.query.publishedBefore != null && request.query.publishedBefore != '' ) {

        query = query.lte('publishDate', request.query.publishedBefore ); // lte - less than or equal to

    }

    if ( request.query.publishedAfter != null && request.query.publishedAfter != '' ) {

        query = query.lte('publishDate', request.query.publishedAfter ); // lte - greater than or equal to

    }

    try {

        const books = await query.exec();

        response.render('books/index', {
            books: books,
            searchOptions: request.query
        });

    } catch {

        response.redirect('/');

    }

});

// New Book Route
router.get('/new', async ( request, response ) => {

    renderNewPage( response, new Book(), 'new' );

});

// Create Book Route
router.post('/', async ( request, response ) => {

    const book = new Book({
        title: request.body.title,
        author: request.body.author,
        publishDate: new Date( request.body.publishDate ),
        pageCount: request.body.pageCount,
        description: request.body.description
    });

    saveCover( book, request.body.cover );

    try {

        const newBook = await book.save();

        response.redirect(`books/${ newBook.id }`);

    } catch {

        renderNewPage( response, book, 'new', true );

    }

});

router.get('/:id', async ( request, response ) => { // show book route

    try {

        const book = await Book.findById( request.params.id )
                               .populate('author') // populate put author object insode book and we can get info about author from book, itherwise it will be just and id
                               .exec();

        response.render('books/show', {
            book: book
        });

    } catch {

        response.redirect('/');

    }

});

router.get('/:id/edit', async ( request, response ) => { // Edit book route

    try {

        const book = await Book.findById( request.params.id );

        renderEditPage( response, book, 'edit' );

    } catch {

        response.redirect('/');

    }

});

// Update Book Route
router.put('/:id', async ( request, response ) => {

    let book

    try {

        book = await Book.findById( request.params.id );

        book.title = request.body.title;
        book.author = request.body.author;
        book.publishDate = new Date( request.body.publishDate );
        book.pageCount = request.body.pageCount
        book.description = request.body.description

        if ( request.body.cover != null && request.body.cover != '' ) {

            saveCover( book. require.body.cover );

        }

        await book.save();

        response.redirect(`/books/${ book.id }`);

    } catch {

        if ( book != null ) {

            renderEditPage( response, book, 'edit', true );

        } else {

            response.redirect('/');

        }

        

    }

});

router.delete('/:id', async ( request, response ) => { // Delete Book Page

    let book 

    try {

        book = await Book.findById( request.params.id );

        await book.delete();

        response.redirect('/books');

    } catch {

        if ( book != null ) {

            response.render('books/show', {
                book: book,
                errorMessage: 'Could not remove book'
            });

        } else {

            response.redirect('/');

        }

    }   

});

async function renderEditPage( response, book, form, hasError = false ) {

    renderFormPage( response, book, 'edit', hasError );

}

async function renderNewPage( response, book, form, hasError = false ) {

    renderFormPage( response, book, 'new', hasError );

}

async function renderFormPage( response, book, form, hasError = false ){

    try {

        const authors = await Author.find({});

        const params = {
            authors: authors,
            book: book
        }

        if ( hasError ) {

            if ( form === 'edit' ) {

                params.errorMessage = 'Error Updating Book';

            } else {

                params.errorMessage = 'Error Creating Book';

            }

        }

        response.render(`books/${ form }`, params );

    } catch {

        response.redirect('/books')

    }

};

function saveCover( book, coverEncoded ) {

    if ( coverEncoded == null ) return;

    const cover = JSON.parse( coverEncoded );

    if ( cover != null && imageMimeTypes.includes( cover.type )) {

        book.coverImage = new Buffer.from( cover.data, 'base64' );

        book.coverImageType = cover.type;

    }

}

module.exports = router;
const mongoose = require('mongoose');
const path = require('path');

const coverImageBasePath = 'uploads/bookCovers';

const bookSchema = new mongoose.Schema({ // Schema params
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        ref: 'Author' // name here should match with model we created in Schema, in our case it's Author
    }
});

bookSchema.virtual('coverImagePath').get( function(){ // in this case we use standart function instead arrow function because we need this context from our book class

    if ( this.coverImageName != null ) {

        return path.join('/', coverImageBasePath, this.coverImageName ); // root folder ( puclic ), path to the covers book folder, name of the file

    }

}); // it allow us create virtual property

module.exports = mongoose.model( 'Book', bookSchema ); // Define new schema
module.exports.coverImageBasePath = coverImageBasePath;
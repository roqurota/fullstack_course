const mongoose = require('mongoose');

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
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
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

    if ( this.coverImage != null  && this.coverImageType != null ) {

        return `data:${ this.coverImageType };charset=utf-8;base64,${ this.coverImage.toString('base64')}`

    }

}); // it allow us create virtual property

module.exports = mongoose.model( 'Book', bookSchema ); // Define new schema
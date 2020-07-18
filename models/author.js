const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({ // Schema params
   name: {
       type: String,
       required: true
   }
});

module.exports = mongoose.model( 'Author', authorSchema ); // Define new schema
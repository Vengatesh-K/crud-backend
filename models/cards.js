const mongoose = require('mongoose');
const { Schema } = mongoose;

const cardSchema = new Schema({
    cardId:{
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
    }
    } 
);


module.exports = mongoose.model('Card', cardSchema);
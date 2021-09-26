const mongoose = require('mongoose')
const { Schema } = mongoose ;

const messages = new Schema({
    id: {
        type: Number,
        required: true,
    },
    msgfrom: {
        type:String,
        required: true, 
    },
    msgto: {
        type:String,
        required: true, 
    },
    msgtitel: {
        type:String,
        required: true, 
    },
    msgcontent: {
        type:String,
        required: true, 
    },
    thetime: {
        type:String,
        required: true, 
    },
    thedate: {
        type:String,
        required: true, 
    },

})

const message= mongoose.model('message', messages);

module.exports = message ;
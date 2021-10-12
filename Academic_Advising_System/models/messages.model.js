const mongoose = require('mongoose')
const { Schema } = mongoose ;

const messages = new Schema({
   
    msgfrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'students'
        
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
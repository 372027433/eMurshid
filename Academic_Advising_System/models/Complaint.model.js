const mongoose = require('mongoose')
const { Schema } = mongoose ;

const Complaints = new Schema({
   
    compfrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'students'
        
    },
    disc: {
        type:String,
        required: true, 
    },
    prove: {
        type:String,
        required: true, 
    },
    advisorcomm: {
        type:String,
        required: true, 
    },
    advisingunitcomm: {
        type:String,
        required: true, 
    },
    deancomm: {
        type:String,
        required: true, 
    },
    diss: {
        type:String,
        required: true, 
    }

})

const Complaint= mongoose.model('message', Complaints);

module.exports = Complaint ;
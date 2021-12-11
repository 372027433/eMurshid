const mongoose = require('mongoose')
const { Schema } = mongoose ;

const Complaints = new Schema({
   
    compfromstudent: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'students'      
        
    },
    compfromadvisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'staff'      
    },
    role:{
        type: Boolean
    },
    disc: {
        type:String,
        required: true, 
    },
    prove: {
        type:String,
        required: true, 
    },
    dateofsubmit: {
        type:String,
        required: true, 
    },
      diss: {
        type:String,
        required: true, 
    },
    dateofdiss: {
        type:String,
        required: true, 
    }

})

const Complaint= mongoose.model('Complaint', Complaints);

module.exports = Complaint ;
const mongoose = require('mongoose')
const Schema = mongoose.Schema ;

const semesters = new Schema({
    startDate: {
        type: Date,
        required:true
    },
    endDate: {
        type: Date,
        required:true
    },
    code:{
      type: String,
        required:true
    },
    college: { type: Schema.Types.ObjectId , ref : 'colleges'},
})

const Semesters = mongoose.model('semesters', semesters)

module.exports = Semesters ;

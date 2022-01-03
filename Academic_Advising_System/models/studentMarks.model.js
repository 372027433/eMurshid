
const mongoose = require('mongoose')
const { Schema } = mongoose ;
const studentMarksSchema = new Schema({
    student : { type: Schema.Types.ObjectId , ref : 'students'},
    marks:[
        {
            course: {type: Schema.Types.ObjectId, ref: 'courses'},
            course: {type: String},
            absence: {
                type: Number,
            },
            other: {
                type: Number,
            },
            firstMid: {
                type: Number,
            },
            secondMid: {
                type: Number,
            }
        }
    ],
    semester : { type: String , required:true},



});
const Marks = mongoose.model('marks', studentMarksSchema);

module.exports = Marks ;
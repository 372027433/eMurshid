const mongoose = require('mongoose')
const Schema = mongoose.Schema ;

const advivsorStudents = new Schema({
    advisor: {
        type: mongoose.Types.ObjectId,
        ref: 'staff',
        required: true
    },
    students: [
        {
            type: mongoose.Types.ObjectId,
            ref:'students'
        }
    ]
})

const AdvivsorStudents = mongoose.model('advivsorStudents', advivsorStudents)

module.exports = AdvivsorStudents ;


const mongoose = require('mongoose');
// const {advisor, advisingUnit, dean} = require('../utils/roles');
const { Schema } = mongoose ;

const coursesSchema = new Schema({
    name:{
        type : String ,
        required: true,
    },
    code:{
        type : String ,
        required: true,
    },
    hours:{
        type: Number,
        required: true,
    },

    major:
        [
        { type: Schema.Types.ObjectId , ref : 'majors'}
        ]
    ,
    college: { type: Schema.Types.ObjectId , ref : 'colleges'},

})

const Courses = mongoose.model('courses', coursesSchema)

module.exports = Courses ;
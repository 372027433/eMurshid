
const mongoose = require('mongoose');
const { Schema } = mongoose ;

const majorsSchema = new Schema({
    name:{
        type : String ,
        required: true,
    },
    code:{
        type : String ,
        required: true,
    },
    college: { type: Schema.Types.ObjectId , ref : 'colleges'},
})

const Majors = mongoose.model('majors', majorsSchema)
module.exports = Majors ;

const mongoose = require('mongoose');
const { Schema } = mongoose ;

const collegesSchema = new Schema({
    name:{
        type : String ,
        required: true,
    },
    code:{
        type : String ,
        required: true,
    },
})

const Colleges = mongoose.model('colleges', collegesSchema)
module.exports = Colleges ;
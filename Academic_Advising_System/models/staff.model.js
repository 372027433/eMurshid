
const mongoose = require('mongoose');
const {advisor, advisingUnit, dean} = require('../utils/roles');
const { Schema } = mongoose ;

const staffSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type:String,
        required: true, 
    },
    password: {
        type:String,
        required: true,
    },
    email : {
        type: String,
        required: true,
    },
    faculty_id: {type: String },
    phone: {
        type: Number,
        max: [9999999999, 'phone numbers do not have more than 10 digits'],
    },
    role: {
        type: String,
        enum: [advisor, advisingUnit, dean],
        required: true, 
    }
},{
    collection:'staff',
    timestamps: true,
})

const Staff = mongoose.model('staff', staffSchema);

module.exports = Staff ;
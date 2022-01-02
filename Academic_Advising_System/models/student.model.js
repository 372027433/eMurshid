
const mongoose = require('mongoose')
const { Schema } = mongoose ;
const { computer_colege, engineering_college,science_college} = require('../utils/facultyType')
const studentSchema = new Schema({
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
    role: {
        type: String,
        required: true, 
    },
    advisor_id : {
        type: Schema.Types.ObjectId,
        ref: 'staff',
    },
    status: String , // should be undergraduate
    major: { type: Schema.Types.ObjectId , ref : 'majors'},
    phone: {
        type: Number,
        max: [9999999999, 'phone numbers do not have more than 10 digits'],
    },
    cgpa: {
        type: Number,
        max: [5, 'highest percent'],
    },
    level:{
        type: Number,
        max : [10, 'max level is 10']
    },
    college: { type: Schema.Types.ObjectId , ref : 'colleges'},

        // student Personal Information
    marital_status: String,
    family_members_count: Number,
    order_in_family: String,
    permanent_address: String,
    present_address: String,
    reference_person: String,
    reference_person_phone: Number,
},
{
    collection:'students',
    timestamps: true
})

const Students = mongoose.model('students', studentSchema);

module.exports = Students ;

const mongoose = require('mongoose')
const { Schema } = mongoose ;

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
        type: String,
    } ,
    faculty_id: String, // should be Faculity IDs which taken from advisingUnit since each advisingUnit will add their students
    // so once added we will be adding advisingUnitMemberFaculityID and add to student
    // and advisors
    
    status: String , // should be undergraduate
    major: String,
    phone: {
        type: Number,
        max: [9999999999, 'phone numbers do not have more than 10 digits'],
    },
    cgpa: {
        type: Number,
        max: [5, 'highest percent'],
    },
    
    // student Personal Information
    famliy_members_count: Number,
    permenet_addres: String,
    present_address: String,
    reference_person: String,
    reference_person_phone: Number,
})

const Students = mongoose.model('students', studentSchema);

module.exports = Students ;
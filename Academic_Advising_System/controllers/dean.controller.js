
// Complaint MODEL
const Complaint = require('../models/Complaint.model')

const Students = require('../models/student.model')
const faculty = require('../utils/facultyType')


exports.renderMainPage = (req, res) => {    
    res.render('deanPages/deanMain',{
        layout: 'dean'
    })
}

exports.renderResolvedExcuses = (req, res) => {
    res.render('deanPages/deanResolvedExcuses',{
        layout: 'dean'
    })
}

exports.renderComplaints = async (req, res) => {
    const Compl = await Complaint.find({}).populate('compfrom','name id');
    console.log(Compl)
        res.render('deanPages/deanComplaints',{
        complist : Compl ,
        layout: 'dean'
    })
}

exports.renderPendingExcuses = (req, res) => {
    res.render('deanPages/deanPendingExcuses',{
        layout: 'dean'
    })
}

exports.renderRegisteredStudents = async (req, res) => {
    try{

        let collegeStudents = await Students.find({faculty_id: res.user.faculty}).select('-password').populate('advisor_id')

        const students = []
        for(let student of collegeStudents){
            let studentObj = {}

            studentObj['name'] = student.name
            studentObj['id'] = student.id
            studentObj['status'] = student.status
            studentObj['advisor'] =  (student.advisor_id?.name) ? student.advisor_id?.name : "-----"
    
            students.push(studentObj)
            
        }

        res.render('deanPages/deanRegisteredStudents',{
            layout: 'dean',
            students: students, 
        })
    } catch(e){
        res.status(400).json({msg: 'error happening' + e})
    }
}
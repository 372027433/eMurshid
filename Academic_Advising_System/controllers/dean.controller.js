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

exports.renderComplaints = (req, res) => {
    res.render('deanPages/deanComplaints',{
        layout: 'dean'
    })
}

exports.renderPendingExcuses = (req, res) => {
    res.render('deanPages/deanPendingExcuses',{
        layout: 'dean'
    })
}

exports.renderRegisteredStudents = async (req, res) => {
    let collegeStudents = await Students.find({faculty_id: faculty.computer_colege}).select('-password').populate('advisor_id')
    // console.log(collegeStudents.length)
    const students = []
    for(let student of collegeStudents){
        let studentObj = {}
        
        studentObj['name'] = student.name
        studentObj['id'] = student.id
        studentObj['status'] = student.status
        studentObj['advisor'] = student.advisor_id.name

        students.push(studentObj)
        
    }
    // console.log(students)
    res.render('deanPages/deanRegisteredStudents',{
        layout: 'dean',
        students: students, 
    })
}
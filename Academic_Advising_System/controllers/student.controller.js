const {renderMyMessages} = require("./student.controller");
exports.renderMainPage = (req, res) => {
    res.render('studentPages/studentMain',{
        layout: 'student'
    })
};

exports.seeThings = (req, res) => {
    console.log('hi')
    res.status(200).redirect('/student')
}


exports.renderStudentProfile = (req, res) => {
    res.render('studentPages/studentProfile', {
        layout: 'student'
    });
};

exports.renderContactAdvisor = (req, res) => {
    res.render('studentPages/contactStudentToAdvisor', {
        layout: 'student'
    });
};

exports.renderMyMessages = (req, res) => {
    res.render('studentPages/studentMessages', {
        layout: 'student'
    });
};

exports.renderBookAppointment = (req, res) => {
    res.render('studentPages/bookAppointment', {
        layout: 'student'
    });
};

exports.renderUpdateMarks = (req, res) => {
    res.render('studentPages/studentUpdateMarks', {
        layout: 'student'
    });
};

exports.renderUpdateAbsence = (req, res) => {
    res.render('studentPages/studentUpdateAbsence', {
        layout: 'student'
    });
};

exports.renderNewComplaint = (req, res) => {
    res.render('studentPages/studentNewComplaint', {
        layout: 'student'
    });
};

//exports.renderComplaintStatus ...


exports.renderNewExcuse = (req, res) => {
    res.render('studentPages/studentExcuses', {
        layout: 'student'
    });
};

const studentRouter = require("../routes/student.router");
const {renderMyMessages} = require("./student.controller");

//Message MOdel
const message = require('../models/messages.model')

exports.renderMainPage = (req, res) => {
    res.render('studentPages/studentMain',{
        layout: 'student'
    })
};

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

exports.messagesend = (req, res) => {
    console.log("hi my func")

    let thedatenow = new Date();

    let messagerecord = new message({
        id : "1",
        msgfrom : "372029223",
        msgto : "44555",
        msgtitel : req.body.Titelmsg,
        msgcontent : req.body.massegContent,
        thetime : `${thedatenow.getHours()}:${thedatenow.getMinutes()}`,
        thedate : `${thedatenow.getDate()}/${thedatenow.getMonth()+1}/${thedatenow.getFullYear()}`
    }); 
    messagerecord.save();

    res.render("studentPages/contactStudentToAdvisor",{
        layout: 'student' 
    })
    
}

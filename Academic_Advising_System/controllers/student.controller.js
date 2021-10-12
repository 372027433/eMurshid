const studentRouter = require("../routes/student.router");
const {renderMyMessages} = require("./student.controller");

//Message MOdel
const message = require('../models/messages.model')
// student MODELS
const Students = require('../models/student.model')
// Staf MODELS
const staff = require('../models/staff.model')

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

exports.renderMyMessages = async (req, res) => {
  let x = await message.find({"msgto" : `${res.user.userId}`}).populate('msgfrom','name -_id').exec(function(err,posts){
    if(err){
            res.render('studentPages/studentMessages' , {
                err: err ,
            }); 
            console.log(err);
        }
        else {
         res.render('studentPages/studentMessages' , {
             messagesList : posts.reverse(),
             layout : 'student'
         })      
        } 
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
//msgto : res.user.advisor_id

exports.messagesend = (req, res) => {
    let thedatenow = new Date();
    let messagerecord = new message({
        msgfrom : res.user.userId ,
        msgto : "61606be7cf646e13ed87a747",
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

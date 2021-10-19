// StudentsAdvisor MODELS
const AdvivsorStudents = require('../models/studentsAdvisor')

//Message MOdel
const message = require('../models/messages.model')

// Students MODELS
const Students = require('../models/student.model')

exports.renderMainPage = (req, res) => {
    res.render('advisorPages/advisorMain',{
        layout: 'advisor'
    })
}

exports.renderPersonalProfile = (req, res) => {
    res.render('advisorPages/advisorProfile',{
        layout: 'advisor'
    })
}

exports.renderMyStudents = async (req, res) => {
    const studentofadvisor = await AdvivsorStudents.find({"advisor" : `${res.user.userId}`}).populate("students","-password");
    let x = studentofadvisor[0];
    let y = x.students;

    res.render('advisorPages/advisorMyStudents',{
        studentsad : y,
        layout: 'advisor'
    })
}

exports.renderRequestReports = (req, res) => {
    res.render('advisorPages/advisorRequestReports',{
        layout: 'advisor'
    })
}

exports.renderOfficeHours = (req, res) => {
    res.render('advisorPages/advisorOfficeHours',{
        layout: 'advisor'
    })
}

exports.renderAppointments = (req, res) => {
    res.render('advisorPages/advisorAppointments',{
        layout: 'advisor'
    })
}

exports.renderMessageStudents = async (req, res) => {

    const studentofadvisor = await AdvivsorStudents.find({"advisor" : `${res.user.userId}`}).populate("students","-password");
        let x = studentofadvisor[0];
        let y = x.students;
    res.render('advisorPages/advisorMessageStudents',{
        studentsad : y,
        layout: 'advisor'
    })
}

exports.renderFindMessage = async (req, res) => {
    let x = await message.find({"msgto" : `${res.user.userId}`}).populate('msgfrom','name -_id').exec(function(err,posts){
        // ther is ero her that the msg from advisor return null
        console.log(posts)
        if(err){
            res.render('advisorPages/advisorFindMessages',{
                    err: err ,
                }); 
                console.log(err);
            }
            else {
                res.render('advisorPages/advisorFindMessages',{
                 messagesList : posts.reverse(),
                 layout: 'advisor'
             })      
            } 
      });
    
}

exports.renderIssueComplaint = (req, res) => {
    res.render('advisorPages/advisorIssueComplaint',{
        layout: 'advisor'
    })
}

exports.renderResolveExcuses = (req, res) => {
    res.render('advisorPages/advisorResolveExcuses',{
        layout: 'advisor'
    })
}



exports.messagesend = async (req, res) => {
    const z = await Students.find({"id" : `${req.body.msgto}`});
    const inarr =z[0];
    let thedatenow = new Date();
    let messagerecord = new message({
        msgfrom    : res.user.userId ,
        msgto      : inarr._id,
        msgtitel   : req.body.Titelmsg,
        msgcontent : req.body.massegContent,
        thetime    : `${thedatenow.getHours()}:${thedatenow.getMinutes()}`,
        thedate    : `${thedatenow.getDate()}/${thedatenow.getMonth()+1}/${thedatenow.getFullYear()}`
    }); 
    messagerecord.save();

    const studentofadvisor = await AdvivsorStudents.find({"advisor" : `${res.user.userId}`}).populate("students","-password");
    let x = studentofadvisor[0];
    let y = x.students;

    res.render('advisorPages/advisorMessageStudents',{
        studentsad : y,
        layout: 'advisor'
    })
    
}
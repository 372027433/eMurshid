/**
 * This file handles all the routes for the student
*/

const studentRouter = require('express').Router();
const controller = require('../controllers/student.controller');
// const {body} = require('express-validator/check')
const { validator, check , body} = require('express-validator');

const {uploader} = require('../middleware/multer')
const multer = require("multer");


//student navBar navigation and route handling
//main page get + post router
studentRouter.get('/', controller.renderMainPage)

// ** Post,Put.. reqs must be added and handled later **

// student Profile router
studentRouter.get('/studentProfile',controller.renderStudentProfile);
studentRouter.post('/studentProfile',
    [
        body (['major','martialStatus'],'Please select Major And Martial Status').not().isEmpty(),
        body(['permanentAddress','presentAddress','referencePerson'] , ' only text values are valid in permanentAddress & presentAddress & referencePerson')
            .not().isEmpty().trim().escape()
            .matches('^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z-_ ]*$'),
        body(['familyMembersCount','orderInFamily' , 'referencePersonPhone'],'only numbers are valid in family Members Count & order In Family & reference Person Phone & CGPA')
            .not().isEmpty().trim().escape()
            .isNumeric(),
        body('cgpa', 'cgpa must be a number between 0 and 5')
            .isFloat({ min: 0, max: 5 })
    ]
    ,controller.renderStudentProfileEdit);


// Contact Advisor as a student
studentRouter.get('/contactAdvisor',controller.renderContactAdvisor);



//student messages router
studentRouter.get('/studentMessages',controller.renderMyMessages);


//student messages router
studentRouter.get('/bookAnAppointment',controller.renderBookAppointment);
// student book appointments
studentRouter.post('/appointment/show',controller.showAvailabilityTimes);

studentRouter.post('/appointment/book',controller.bookTimeWithAdvisor);
// show student booked times
studentRouter.get('/appointments',controller.renderReservedAppointments);


//student marks update router
studentRouter.get('/updateMarks',controller.renderUpdateMarks);


//update Absence Router
studentRouter.get('/updateAbsence',controller.renderUpdateAbsence);
studentRouter.get('/updateAbsence',(req, res) => {

});


//issue a new complaint router
studentRouter.get('/newComplaint',controller.renderNewComplaint);

 // Show the Result Of the Complaint
 studentRouter.get('/showTheResultOfComplain',controller.rendershowTheResultOfComplain);


//get newAbsenceExcuse router
studentRouter.get('/newAbsenceExcuse',controller.renderGetNewAbsenceExcuse);
//Post newAbsenceExcuse router
studentRouter.post('/newAbsenceExcuse' ,[(req, res,next)=>{
    uploader(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            req.uploadError = err
            next()
        } else if (err) {
            // An unknown error occurred when uploading.
        }
        next()
        // Everything went fine and save document in DB here.
    })},
]
    , controller.renderPostNewAbsenceExcuse);

//get makeupexam router
studentRouter.get('/newExamExcuse',controller.renderGetNewExamExcuse);
//Post makeupexam router
studentRouter.post('/newExamExcuse' ,[(req, res,next)=>{
        uploader(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                req.uploadError = err
            } else if (err) {
                req.uploadError = err
            }
            next()
            // Everything went fine and save document in DB here.
        })},
    ]
    , controller.renderPostNewExamExcuse);





studentRouter.post("/hm" , controller.messagesend);
 studentRouter.post("/compl" , 
 [(req, res,next)=>{
    uploader(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            req.uploadError = err
        } else if (err) {
            req.uploadError = err
        }
        next()
        // Everything went fine and save document in DB here.
    })},
]
 , controller.submitcomp);




module.exports = studentRouter ;
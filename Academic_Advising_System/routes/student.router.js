/**
 * This file handles all the routes for the student
*/

const studentRouter = require('express').Router();
const controller = require('../controllers/student.controller');
// const {body} = require('express-validator/check')
const { validator, check , body} = require('express-validator');


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
        body(['familyMembersCount','orderInFamily' , 'referencePersonPhone'],'only numbers are valid in family Members Count & order In Family & reference Person Phone')
            .not().isEmpty().trim().escape()
            .isNumeric()
    ]
    ,controller.renderStudentProfileEdit);


// Contact Advisor as a student
studentRouter.get('/contactAdvisor',controller.renderContactAdvisor);



//student messages router
studentRouter.get('/studentMessages',controller.renderMyMessages);


//student messages router
studentRouter.get('/bookAnAppointment',controller.renderBookAppointment);


//student marks update router
studentRouter.get('/updateMarks',controller.renderUpdateMarks);


//update Absence Router
studentRouter.get('/updateAbsence',controller.renderUpdateAbsence);
studentRouter.get('/updateAbsence',(req, res) => {

});


//issue a new complaint router
studentRouter.get('/newComplaint',controller.renderNewComplaint);

//submit a new excuse router
studentRouter.get('/newExcuse',controller.renderNewExcuse);



studentRouter.post("/hm" , controller.messagesend);
 studentRouter.post("/compl" , controller.submitcomp);
module.exports = studentRouter ;
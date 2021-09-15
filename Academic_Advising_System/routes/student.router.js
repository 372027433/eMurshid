/**
 * This file handles all the routes for the student
*/

const studentRouter = require('express').Router();
const controller = require('../controllers/student.controller');

//student navBar navigation and route handling
//main page get + post router
studentRouter.get('/', controller.renderMainPage)
studentRouter.post('/',controller.renderMainPage)

// ** Post,Put.. reqs must be added and handled later **

// student Profile router
studentRouter.get('/studentProfile',controller.renderStudentProfile);
// studentRouter.post('/studentProfile',controller.) ...


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


//issue a new complaint router
studentRouter.get('/newComplaint',controller.renderNewComplaint);

//submit a new excuse router
studentRouter.get('/newExcuse',controller.renderNewExcuse);





module.exports = studentRouter ;
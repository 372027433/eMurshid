/**
 * This file handles all the routes for the advising unit  
*/

const advisingUnitRouter = require('express').Router();
const controller = require('../controllers/advisingUnit.controller');

advisingUnitRouter.get('/', controller.renderMainPage)

advisingUnitRouter.get('/registerStudents', controller.renderStudentRegisterPage)
// here we need to create the form to fill students then we can add new students to the system
advisingUnitRouter.post('/',controller.registerStudents);

module.exports = advisingUnitRouter ;
/**
 * This file handles all the routes for the student 
*/

const studentRouter = require('express').Router();
const controller = require('../controllers/student.controller');

studentRouter.get('/', controller.renderMainPage)

studentRouter.post('/',controller.renderMainPage)

module.exports = studentRouter ;
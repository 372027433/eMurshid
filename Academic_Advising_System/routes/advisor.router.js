/**
 * This file handles all the routes for the advisor 
*/

const advisorRouter = require('express').Router();
const controller = require('../controllers/advisor.controller');

advisorRouter.get('/', controller.renderMainPage)

module.exports = advisorRouter ;
/**
 * This file handles all the routes for the dean and vice-dean 
*/

const deanRouter = require('express').Router();
const controller = require('../controllers/dean.controller');

deanRouter.get('/', controller.renderMainPage)

module.exports = deanRouter ;

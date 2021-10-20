/**
 * This file handles all the routes for the dean and vice-dean 
*/

const deanRouter = require('express').Router();
const controller = require('../controllers/dean.controller');

deanRouter.get('/', controller.renderMainPage)


deanRouter.get('/resolvedExcuses',controller.renderResolvedExcuses);

deanRouter.get('/pendingExcuses',controller.renderGetPendingExcuses);
deanRouter.post('/pendingExcuses',controller.renderPostPendingExcuses);
deanRouter.get('/pendingExcuses/proof/:key',controller.renderGetProof);


deanRouter.get('/complaints',controller.renderComplaints);

deanRouter.get('/registeredStudents',controller.renderRegisteredStudents);













module.exports = deanRouter ;

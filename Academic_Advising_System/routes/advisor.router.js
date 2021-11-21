/**
 * This file handles all the routes for the advisor
*/

const advisorRouter = require('express').Router();
const controller = require('../controllers/advisor.controller');

advisorRouter.get('/', controller.renderMainPage)

advisorRouter.get('/personalProfile',controller.renderPersonalProfile);

advisorRouter.get('/myStudents',controller.renderMyStudents);

advisorRouter.get('/requestReports',controller.renderRequestReports);

advisorRouter.get('/officeHours',controller.renderOfficeHours);

advisorRouter.get('/appointments',controller.renderAppointments);

advisorRouter.get('/messageStudents',controller.renderMessageStudents);

advisorRouter.get('/findMessage',controller.renderFindMessage);

advisorRouter.get('/issueComplaint',controller.renderIssueComplaint);

advisorRouter.get('/resolveExcuses',controller.renderGetResolveExcuses);
advisorRouter.post('/resolveExcuses',controller.renderPostResolveExcuses);
advisorRouter.get('/resolveExcuses/proof/:key',controller.renderGetProof);


advisorRouter.post("/advisorSendToStudent" , controller.messagesend);

advisorRouter.post("/scheduling" , controller.createTimeSchedules);








module.exports = advisorRouter ;
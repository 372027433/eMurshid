// express router
const router = require('express').Router();

// login controller
const loginController = require('./controllers/login.controller')

// authorization
const {isAuthorized} = require('./middleware/auth');

// other routes
const advisingUnitRouter = require('./routes/advisingUnit.router');
const studentRouter = require('./routes/student.router');
const advisorRouter = require('./routes/advisor.router');
const deanRouter = require('./routes/dean.router');

router.get('/', (req,res) => {
    res.render('signIn');
})

router.post('/login', loginController.login)

// Users Routes


/**
 * need to implement something that prevent anybody from going to someother other user page
 * like prevent student from going to dean page may be implement 
 * a function that says isDean(), isAdvisingUnit(), isStudent(), isAdvisor() as a middleware which will redirect user to his page
 */
router.use('/advisingUnit', advisingUnitRouter )

router.use('/student', isAuthorized, studentRouter )

router.use('/dean', deanRouter)

router.use('/advisor', advisorRouter)


module.exports = router ;
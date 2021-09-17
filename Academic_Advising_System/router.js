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

router.use('/advisingUnit', advisingUnitRouter )

router.use('/student', isAuthorized, studentRouter )

router.use('/dean', deanRouter)

router.use('/advisor', advisorRouter)


module.exports = router ;
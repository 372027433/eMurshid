// express router
const router = require('express').Router();

// other routes
const advisingUnitRouter = require('./routes/advisingUnit.router');
const studentRouter = require('./routes/student.router');
const advisorRouter = require('./routes/advisor.router');
const deanRouter = require('./routes/dean.router');

router.get('/', (req,res) => {
    res.render('signIn');
})

router.use('/advisingUnit', advisingUnitRouter )

router.use('/student', studentRouter )

router.use('/dean', deanRouter)

router.use('/advisor', advisorRouter)


module.exports = router ;
// needed libraries
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

// will need the models of Users 
const Students = require('../models/student.model')

exports.login = async (req, res) => {
    //
    // get req.body
    const {id, password} = req.body ;

    // check if id is 9 or less then this
    if(/^[0-9]{9}$/.test(id)){
        console.log('we have 9 digits which is student')

        try{
            const student = await Students.findOne({id: id}).select('password').exec();
            if(!student) return res.status(400).json({msg: 'password or id are not correct'}) // no student present with this id
            console.log(student)

            const comparedPasswords = await bcrypt.compare(password, student.password)
            if(!comparedPasswords) return res.status(400).json({msg: 'password or id are not correct'}) // password is not correct

            /// we should have expiration data, but we don't have a way to refresh
            /// so keep token valid forever 
            // might add Role to user
            let tokenBody = {
                userId: student._id ,
            }

            let token = await jwt.sign(tokenBody,process.env.JWT_ACCESS_KEY);

            res.setHeader('Set-Cookie', `authorization=Bearer ${token}; HttpOnly`)
            // res.cookie('auth-token', `Bearer ${token}`, { httpOnly: true })

            // the proplem is I want to send token together with redirecting

            // WyDKiHIgCG
            // now how add token to header
            return res.status(200).redirect('/')

        }
        catch(e){
            console.log(e)
        }
        // get user by his id password and query the database
        // if password matches then send him header
    } else if (/^[0-9]{8,0}$/.test(id)){
        console.log("this is an advisor or acadmeic unit or dean")
    } else {
        return res.status(400).redirect('/') // fraud user
    }




    // then creat auth header to be saved as header in client

    // res.status(400).redirect('/advisingUnit')
}
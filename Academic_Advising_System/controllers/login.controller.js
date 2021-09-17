// needed libraries
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

// will need the models of Users 
const Students = require('../models/student.model')

exports.login = async (req, res) => {
    //
    // get req.body
    const {id, password} = req.body ;

    // check if id is 9 digits (nothing else) else check if it is less
    if(/^[0-9]{9}$/.test(id)){
       // we have 9 digits which is student

        try {
            // get student from DB
            const student = await Students.findOne({id: id}).select('password').exec();
            // if no student present with this id this is bad request
            if(!student) return res.status(400).json({msg: 'password or id are not correct'}) 
            console.log(student)

            // compare the passwords
            const comparedPasswords = await bcrypt.compare(password, student.password)
            // if passwords do not match then this is bad request
            if(!comparedPasswords) return res.status(400).json({msg: 'password or id are not correct'}) // password is not correct

            /// we should have expiration data, but we don't have a way to refresh token
            /// so keep token valid forever 
            // might add Role to user
            let tokenBody = {
                userId: student._id ,
            }

            let token = await jwt.sign(tokenBody,process.env.JWT_ACCESS_KEY);

            res.setHeader('Set-Cookie', `authorization=Bearer ${token}; HttpOnly`)
            // res.cookie('authorization', `Bearer ${token}`, { httpOnly: true }) // another way to set cookie

            // WyDKiHIgCG -- AbodyPassword
            return res.status(200).redirect('/student')

        }
        catch(e){
            console.log(e)
        }
    } else if (/^[0-9]{8,0}$/.test(id)){
        // Advisor or Acadmeic unit or Dean
        
        // we need to query Advisor, AdvisingUnit, Dean DBs searching for id
        // if we found the id then hash password and send it
    } else {
        return res.status(400).redirect('/') // fraud user
    }




    // then creat auth header to be saved as header in client

    // res.status(400).redirect('/advisingUnit')
}
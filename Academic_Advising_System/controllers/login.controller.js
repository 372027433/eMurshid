// needed libraries
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

// will need the models of Users 
const Students = require('../models/student.model')

// roles
const roles = require('../utils/roles')
console.log(roles)

exports.login = async (req, res) => {
    //

    // here we load the Roles variable to compare other users

    // destructure req.body and get id and password
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

        // NEED TO CREATE A ROLES COLLECTION IN DATABASE
        // from this role collec we compare just like enum 
        
        // query DB for the id
        // once you get the id, 
        // compare passwords
        // take the user Role from DB
        // create jwt with {{_id, role}} from DB
        // assign cookie
        // go into switch statement 2 route to right page
        // in the switch statment

        // we need to query Advisor, AdvisingUnit, Dean DBs searching for id
        // if we found the id then hash password and send it
        switch(userRole){
            case role.Advisor: 
                // return to advisor
                break;
            case role.AdvisingUnit: 
                // return advisor
                break ;
            case role.Dean : 
                // route to dean pages
                break ;
            default: 
                // not a user
                // return to login page
                break ;
            
        }
    } else {
        return res.status(400).redirect('/') // fraud user
    }




    // then creat auth header to be saved as header in client

    // res.status(400).redirect('/advisingUnit')
}

exports.logout = (req, res) => {
    res.clearCookie('authorization')
    return res.status(401).redirect('/')
}
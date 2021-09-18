// needed libraries
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

// will need the models of Users 
const Students = require('../models/student.model')
const Staff = require('../models/staff.model')

// roles
const roles = require('../utils/roles')

exports.login = async (req, res) => {

    // destructure req.body and get id and password
    const {universityID, password} = req.body ;
    const id = universityID ;
    // check if id is 9 digits (nothing else) else check if it is less
    if(/^[0-9]{9}$/.test(id)){
       // we have 9 digits which is student

        try {
            // get student from DB
            const student = await Students.findOne({id: id}).select('password').exec();
            // if no student present with this id this is bad request
            if(!student) return res.status(400).render('signIn',{
                err: true, 
                errMsg: "Invalide id or password"
            })

            // compare the passwords
            const comparedPasswords = await bcrypt.compare(password, student.password)
            // if passwords do not match then this is bad request
            if(!comparedPasswords) return res.status(400).render('signIn',{
                err: true, 
                errMsg: "Invalide id or password"
            })

            /// we should have expiration data, but we don't have a way to refresh token
            /// so keep token valid forever 
            // might add Role to user
            let tokenBody = {
                userId: student._id , // _id student in DB [not his uni id]
                role: roles.student,
            }

            let token = await jwt.sign(tokenBody,process.env.JWT_ACCESS_KEY);

            res.setHeader('Set-Cookie', `authorization=Bearer ${token}; HttpOnly`)
            // res.cookie('authorization', `Bearer ${token}`, { httpOnly: true }) // another way to set cookie

            // WyDKiHIgCG -- AbodyPassword
            return res.status(200).redirect('/student')

        }
        catch(err){
            console.log(err) // should add en error page that renders what should be displayed

        }
    } else if (/^[0-9]{0,8}$/.test(id)){

        // Advisor or Acadmeic unit or Dean

        try {
            // query DB for the id
            const staff = await Staff.findOne({id: id}).select('password role').exec()
            // once you get the id,
            // check if user exists
            
            if(!staff) return res.render('signIn',{ 
                err: true,
                errMsg: "Invalide id or password"
            }) // this rendering is not working because fetch made the reqesuts 
            
            // compare passwords
            const comparePassword = await bcrypt.compare(password, staff.password)
            if(!comparePassword) return res.status(400).render('/',{
                err: true, 
                errMsg: "Invalide id or password"
            })
            // take the user Role from DB
            let tokenBody = {
                userId: staff._id , // _id student in DB [not his uni id]
                role: staff.role ,
            }
            // create jwt with {{_id, role}} from DB
            let token = await jwt.sign(tokenBody, process.env.JWT_ACCESS_KEY);
            // assign cookie
            res.setHeader('Set-Cookie', `authorization=Bearer ${token}; HttpOnly`)

            // go into switch statement 2 route to right page
            // in the switch statment

            // we need to query Advisor, AdvisingUnit, Dean DBs searching for id
            // if we found the id then hash password and send it
        } catch(err){

            console.log(err)
        }
        // might add user name in the screen
        switch(staff.role){
            case roles.advisor: 
                return res.status(200).redirect('/advisor')
                break;

            case roles.advisingUnit: 
                return res.status(200).redirect('/advisingUnit')
                break ;

            case roles.dean : 
                return res.status(200).redirect('/dean')
                break ;

            default: 
                // not a user
                // return to login page
                res.setHeader('Set-Cookie', `authorization= ; HttpOnly`)
                return res.status(200).redirect('/')

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
    res.status(200).redirect('/')
}
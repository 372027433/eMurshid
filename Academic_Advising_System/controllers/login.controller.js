// needed libraries
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Users Models
const Students = require('../models/student.model')
const Staff = require('../models/staff.model')
const Colleges = require('../models/colleges.model')
const Semesters = require('../models/semesters.models')

// roles
const roles = require('../utils/roles')

exports.login = async (req, res) => {

    const { universityID, password } = req.body;
    const id = universityID;
    if (/^[0-9]{9}$/.test(id)) {

        try {
            const student = await Students.findOne({ id: id }).select('password college hasChangedPassword').populate('college').exec();
            if (!student) return res.status(400).render('signIn', {
                err: true,
                errMsg: "Invalid id or password"
            })

            const comparedPasswords = await bcrypt.compare(password, student.password)

            if (!comparedPasswords) return res.status(400).render('signIn', {
                err: true,
                errMsg: "Invalid id or password"
            })

            let tokenBody = {
                userId: student._id, 
                role: roles.student,
                college: student.college._id,
                semester: await getSemester()

            }

            let token = await jwt.sign(tokenBody, process.env.JWT_ACCESS_KEY);

            res.setHeader('Set-Cookie', `authorization=Bearer ${token}; HttpOnly`)

            const isPassEqualID = !student.hasChangedPassword;

            if (isPassEqualID) {
                return res.render('confirmPassword');
            }

            return res.status(200).redirect('/student')

        }
        catch (err) {

            console.log(err) // should add en error page that renders what should be displayed
        }
    } else if (/^[0-9]{1,8}$/.test(id)) {

        // Advisor or Acadmeic unit or Dean

        try {
            const staff = await Staff.findOne({ id: id }).select('password role hasChangedPassword faculty_id college').populate('college').exec()

            if (!staff) return res.status(400).render('signIn', {
                err: true,
                errMsg: "Invalid id or password"
            }) 

            const comparePassword = await bcrypt.compare(password, staff.password)
            if (!comparePassword) return res.status(400).render('signIn', {
                err: true,
                errMsg: "Invalid id or password"
            })

            let tokenBody = {
                userId: staff._id, // _id staff in DB [not his uni id]
                role: staff.role,
                faculty: staff.faculty_id,
                college: staff.college._id,
                semester: await getSemester(),
            }

            let token = await jwt.sign(tokenBody, process.env.JWT_ACCESS_KEY);
            res.setHeader('Set-Cookie', `authorization=Bearer ${token}; HttpOnly`)


            const isPassEqualID = !staff.hasChangedPassword;

            if (isPassEqualID) {
                return res.render('confirmPassword');
            }

            switch (staff.role) {

                case roles.advisor:
                    return res.status(200).redirect('/advisor')
                    break;

                case roles.advisingUnit:
                    return res.status(200).redirect('/advisingUnit')
                    break;

                case roles.dean:
                    return res.status(200).redirect('/dean')
                    break;

                default:
                    res.setHeader('Set-Cookie', `authorization= ; HttpOnly`)
                    return res.status(200).redirect('/')

                    break;
            }
        } catch (err) {

            console.log(err)
        }
    } else {
        return res.status(401).redirect('/')  
    }
    return res.status(401).redirect('/')  

}

exports.logout = (req, res) => {
    res.clearCookie('authorization')
    res.status(200).redirect('/')
}

exports.updatePassword = async (req, res) => {
    const newPassword = req.body.newPass;

    if (roles.student == res.user.role) {
        let student = await Students.findOne({ _id: res.user.userId }).select('id');

        if (student.id == newPassword) {
            return res.render('confirmPassword',{
                errMsg: 'الرجاء استخدام كلمة سر أخرى غير معرف الطالب'
            });
        }

        let hashedPassword = await bcrypt.hash(newPassword, 10);

        await Students.findOneAndUpdate({_id:res.user.userId}, {password:hashedPassword, hasChangedPassword:true});

        return res.redirect('/student');


    } else {

        let staff = await Staff.findOne({ _id: res.user.userId }).select('id');

        if (staff.id == newPassword) {
            return res.render('confirmPassword');
        }

        let hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await Staff.findOneAndUpdate({_id:res.user.userId}, {password:hashedPassword, hasChangedPassword:true}, {new: true});

        if (roles.advisor == res.user.role) {
            return res.status(200).redirect('/advisor')


        } else if (roles.advisingUnit == res.user.role) {
            return res.status(200).redirect('/advisingUnit')


        } else if (roles.dean == res.user.role) {
            return res.status(200).redirect('/dean')
        }
    }

}
async function getSemester() {
    let currentDate = new Date(Date.now())
    let currentSemester;
    const semesters = await Semesters.find({})
    for (let semester of semesters) {
        if ((semester.startDate.getTime() < currentDate) && (semester.endDate.getTime() > currentDate)) {
            currentSemester = semester.code
            break;
        }
    }
    return currentSemester
}
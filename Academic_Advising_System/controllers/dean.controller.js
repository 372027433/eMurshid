
const AbsenceExcuse = require("../models/AbsenceExcuse.model");
const {getFileStream} = require("../utils/s3");


// Complaint MODEL
const Complaint = require('../models/Complaint.model')

const Students = require('../models/student.model')
const faculty = require('../utils/facultyType')


exports.renderMainPage = (req, res) => {    

    res.render('deanPages/deanMain',{
        layout: 'dean'
    })
}

exports.renderResolvedExcuses = (req, res) => {
    res.render('deanPages/deanResolvedExcuses',{
        layout: 'dean'
    })
}

exports.renderComplaints = async (req, res) => {
    const Compl = await Complaint.find({}).populate('compfrom','name id');
    console.log(Compl)
        res.render('deanPages/deanComplaints',{
        complist : Compl.reverse() ,
        layout: 'dean'
    })
}

exports.renderGetProof = async (req , res)=>{
    let key = req.params.key
    const readStream =  await getFileStream(key)
    await readStream.pipe(res)
}

exports.renderGetPendingExcuses = async (req, res) => {
    await AbsenceExcuse.find({status:'aauApproved'}).populate({path :'student'}).
    exec(function (err, doc) {
        if (err) {
            res.render('deanPages/deanPendingExcuses',{
                hasError: true ,
                errorMsg: err.message ,
                layout: 'dean',
            })
            // res.status('400').redirect('/deanPages/deanPendingExcuses')
        }else{
            res.render('deanPages/deanPendingExcuses',{
                hasError: false,
                docs:doc,
                layout: 'dean',
            })
        }
    });
}

exports.renderPostPendingExcuses = async (req, res) => {
    const excuseId = req.body.exId;
    const deanComment = req.body.deanComment;
    if (req.body.hasOwnProperty('recommend')) {
        await AbsenceExcuse.findByIdAndUpdate(excuseId, {
            $set: {
                deanComment: deanComment,
                status: 'deanApproved'
            }
        }, {new: true}, (err, doc) => {
            if (err) {
                const errorMsg = err.message
                res.status('400').redirect('/deanPages/deanPendingExcuses')
            } else {

                res.status('200').redirect('/deanPages/deanPendingExcuses')
            }
        })
    } else if (req.body.hasOwnProperty('reject')) {
       await AbsenceExcuse.findByIdAndUpdate(excuseId, {
            $set: {
                deanComment: deanComment,
                status: 'deanRejected'
            }
        }, {new: true}, (err, doc) => {
            if (err) {
                const errorMsg = err.message
                res.status('400').redirect('/deanPages/deanPendingExcuses')
            } else {
                res.status('200').redirect('/deanPages/deanPendingExcuses')
            }
        })
    }
};


exports.renderRegisteredStudents = async (req, res) => {
    try{

        let collegeStudents = await Students.find({faculty_id: res.user.faculty}).select('-password').populate('advisor_id')

        const students = []
        for(let student of collegeStudents){
            let studentObj = {}

            studentObj['name'] = student.name
            studentObj['id'] = student.id
            studentObj['status'] = student.status
            studentObj['advisor'] =  (student.advisor_id?.name) ? student.advisor_id?.name : "-----"
    
            students.push(studentObj)
            
        }

        res.render('deanPages/deanRegisteredStudents',{
            layout: 'dean',
            students: students, 
        })
    } catch(e){
        res.status(400).json({msg: 'error happening' + e})
    }
}


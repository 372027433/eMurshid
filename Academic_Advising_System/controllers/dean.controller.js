const AbsenceExcuse = require("../models/AbsenceExcuse.model");
const {getFileStream} = require("../utils/s3");
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

exports.renderComplaints = (req, res) => {
    res.render('deanPages/deanComplaints',{
        layout: 'dean'
    })
}



exports.renderGetProof = async (req , res)=>{
    let key = req.params.key
    const readStream =  await getFileStream(key)
    await readStream.pipe(res)
}

exports.renderRegisteredStudents = (req, res) => {
    res.render('deanPages/deanRegisteredStudents',{
        layout: 'dean'
    })
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
    // res.render('deanPages/deanPendingExcuses',{
    //     layout: 'dean'
    // });
// }



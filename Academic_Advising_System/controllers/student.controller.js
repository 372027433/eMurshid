//express imports
const fs = require('fs');
const path = require('path');

const studentRouter = require("../routes/student.router");
const {renderMyMessages} = require("./student.controller");
// define multer lib

const message = require('../models/messages.model')

// Staf MODEL
const staff = require('../models/staff.model')

// Students MODEL
const Students = require('../models/student.model')


//Absence Model
const Excuses = require('../models/AbsenceExcuse.model')

// Validator Results

// Complaint MODEL
const Complaint = require('../models/Complaint.model')

const {validationResult} = require ('express-validator/check')

//
// const multer = require("multer");
const {uploadFile} = require('../utils/s3')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)


exports.renderMainPage = (req, res) => {
    res.render('studentPages/studentMain',{
        layout: 'student'
    })
};

// Handle get request
exports.renderStudentProfile = async (req, res) => {
     const student = await Students.findById(res.user.userId).select("-password").exec();
    res.render('studentPages/studentProfile', {
        stuId: student.id,
        stuName: student.name,
        major: student.major,
        marital_status: student.marital_status,
        family_members_count: student.family_members_count,
        order_in_family: student.order_in_family,
        permanent_address: student.permanent_address,
        present_address: student.present_address,
        reference_person: student.reference_person,
        reference_person_phone: student.reference_person_phone,
        advisor: student.advisor,
        editMode : false,
        layout: 'student',
    });
};

//Handle post Requests
exports.renderStudentProfileEdit = async (req, res) =>{
    // return all from DB except for password

    const student = await Students.findById(res.user.userId).select("-password").exec();
    let majorsSelection = {'computer science':false , 'information technology':false , 'information system':false }
    if(!req.body){
        return res.sendStatus(400);
    }
    // on Edit button click activate Edit mode and render
    else if(req.body.hasOwnProperty("StuEditBtn")){
        // For keeping User inputs
        let majorsSelection = {'computer science':false , 'information technology':false , 'information system':false }
        for (let element in majorsSelection){
            if (student.major === element){
                majorsSelection[element] = true;
                break;
            }
        }

        let maritalSelection = {'single':false, 'married':false}
        for (let element in maritalSelection){
            if (student.marital_status === element){
                maritalSelection[element] = true;
                break;
            }
        }
            res.render('studentPages/studentProfile', {
        email: student.email,
        stuId: student.id,
        stuName: student.name,
        major: student.major,
        marital_status: student.marital_status,
        level: student.level,
        family_members_count: student.family_members_count,
        order_in_family: student.order_in_family,
        permanent_address: student.permanent_address,
        present_address: student.present_address,
        reference_person: student.reference_person,
        reference_person_phone: student.reference_person_phone,
        advisor: student.advisor,
        CS : majorsSelection["computer science"],
        IT : majorsSelection["information technology"],
        IS : majorsSelection["information system"],
        single : maritalSelection.single,
        married : maritalSelection.married,
        editMode: true,
        layout: 'student',
    });
        // On Update Button Click
            }else if (req.body.hasOwnProperty("stuUpdateBtn")){
        //Validation Errors
        const validationErrors = validationResult(req);
        // DB Update Errors
            let error;
        if(!validationErrors.isEmpty()){
                // for HandleBars CSS logic
            let invalid ={ familyMembersCount:false , orderInFamily:false
                , permanentAddress:false , presentAddress:false , referencePerson:false ,advisor:false }
            for(let element in invalid ){
                    if (validationErrors.array().find(e => e.param === element))
                       invalid[element] =true
                }
                // For keeping User inputs
             majorsSelection = {'computer science':false , 'information technology':false , 'information system':false }
            for (let element in majorsSelection){
                if (req.body.major === element){
                    majorsSelection[element] = true;
                break;
                }
            }

            let maritalSelection = {'single':false, 'married':false}
            for (let element in maritalSelection){
                if (req.body.martialStatus === element){
                    maritalSelection[element] = true;
                    break;
                }
            }
            return res.status(422).render('studentPages/studentProfile', {
                stuId: student.id,
                stuName: student.name,
                major: req.body.major,
                marital_status: req.body.martialStatus,
                family_members_count: req.body.familyMembersCount,
                order_in_family: req.body.orderInFamily,
                permanent_address: req.body.permanentAddress,
                present_address: req.body.presentAddress,
                reference_person: req.body.referencePerson,
                reference_person_phone: req.body.referencePersonPhone,
                advisor: req.body.advisor,
                CS : majorsSelection["computer science"],
                IT : majorsSelection["information technology"],
                IS : majorsSelection["information system"],
                single : maritalSelection.single,
                married : maritalSelection.married,
                invalid : invalid,
                editMode : true,
                valErrors : validationErrors.array()[0].msg,
                layout: 'student',
            });
        }
        //Find by id and update
        await Students.findByIdAndUpdate(res.user.userId,  {
                major: req.body.major,
                marital_status: req.body.martialStatus,
                family_members_count: req.body.familyMembersCount,
                order_in_family: req.body.orderInFamily,
                permanent_address: req.body.permanentAddress,
                present_address: req.body.presentAddress,
                reference_person: req.body.referencePerson,
                reference_person_phone: req.body.referencePersonPhone,
            },{
            // return updated doc
            new : true,
                }
            ,
            function (err, docs) {
                if (err){
                    //save error
                    error = err;
                    console.log(err)
                    // render without changes and return error message
                    res.render('studentPages/studentProfile', {
                        stuId: student.id,
                        stuName: student.name,
                        major: student.major,
                        marital_status: student.marital_status,
                        family_members_count: student.family_members_count,
                        order_in_family: student.order_in_family,
                        permanent_address: student.permanent_address,
                        present_address: student.present_address,
                        reference_person: student.reference_person,
                        reference_person_phone: student.reference_person_phone,
                        advisor: student.advisor,
                        editMode : false,
                        errorMessage : error.message,
                        layout: 'student',
                    });
                }
                else{
                    // success => return new doc with success msg
                    res.render('studentPages/studentProfile', {
                        email: docs.email,
                        stuId: docs.id,
                        stuName: docs.name,
                        major: docs.major,
                        marital_status: docs.marital_status,
                        family_members_count: docs.family_members_count,
                        order_in_family: docs.order_in_family,
                        permanent_address: docs.permanent_address,
                        present_address: docs.present_address,
                        reference_person: docs.reference_person,
                        reference_person_phone: docs.reference_person_phone,
                        advisor: docs.advisor,
                        layout: 'student',
                        successMessage : "Data Updated Successfully",
                        editMode : false,
                    });
                }
            });
        }
}



exports.renderContactAdvisor = (req, res) => {
    res.render('studentPages/contactStudentToAdvisor', {
        layout: 'student'
    });
};

exports.renderMyMessages = async (req, res) => {
  let x = await message.find({"msgto" : `${res.user.userId}`}).populate('msgfrom','name -_id').exec(function(err,posts){
    // ther is ero her that the msg from advisor return null
    console.log(posts)
    if(err){
            res.render('studentPages/studentMessages' , {
                err: err ,
            }); 
            console.log(err);
        }
        else {
         res.render('studentPages/studentMessages' , {
             messagesList : posts.reverse(),
             layout : 'student'
         })      
        } 
  });
  
};


exports.renderBookAppointment = (req, res) => {
    res.render('studentPages/bookAppointment', {
        layout: 'student'
    });
};

exports.renderUpdateMarks = (req, res) => {
    res.render('studentPages/studentUpdateMarks', {
        layout: 'student'
    });
};

exports.renderUpdateAbsence = (req, res) => {
    res.render('studentPages/studentUpdateAbsence', {
        layout: 'student'
    });
};

exports.renderNewComplaint = async (req, res) => {
    const getstuinfo = await Students.find({"_id" : `${res.user.userId}`}).populate("advisor_id" , "name");
    const getinarr = getstuinfo[0];
    res.render('studentPages/studentNewComplaint', {
        stuname :getinarr.name ,
        stuid : getinarr.id,
        stumajor : getinarr.major,
        stuadvisor : getinarr.advisor_id.name,
        layout: 'student'
    });
};

//exports.renderComplaintStatus ...


exports.renderGetNewAbsenceExcuse = async (req, res) => {
    const student = await Students.findById(res.user.userId).select("-password").exec();
    res.render('studentPages/studentNewAbsenceExcuse', {
        stuName : student.name,
        stuId : student.id,
        major : student.major,
        level : student.level,
        layout: 'student'
    });
};

exports.renderPostNewAbsenceExcuse = async (req, res) => {
    if(!req.body){
        return res.sendStatus(400);
    }else
    {
        const student = await Students.findById(res.user.userId).select("-password").exec();


       const stuName  = student.name;
        const stuId = student.id;
        const  major = student.major;
        const level = student.level;
        const dateFrom = req.body.dateFrom;
        const dateTo = req.body.dateTo;
        const info0 = {
            code : req.body.code0,
            courseName: req.body.courseName0,
            section : req.body.section0,
            lecturer: req.body.lecturer0
        }
        const info1 = {
            code : req.body.code1,
           courseName: req.body.courseName1,
           section : req.body.section1,
           lecturer: req.body.lecturer1
        }
        const info2 = {
            code : req.body.code2,
            courseName: req.body.courseName2,
            section : req.body.section2,
            lecturer: req.body.lecturer2
        }
        const info3 = {
            code : req.body.code3,
            courseName: req.body.courseName3,
            section : req.body.section3,
            lecturer: req.body.lecturer3
        }
        const info4 = {
            code : req.body.code4,
            courseName: req.body.courseName4,
            section : req.body.section4,
            lecturer: req.body.lecturer4,
        }
        const info5 = {
            code : req.body.code5,
            courseName: req.body.courseName5,
            section : req.body.section5,
            lecturer: req.body.lecturer5
        }
        const info6 = {
            code : req.body.code6,
            courseName: req.body.courseName6,
            section : req.body.section6,
            lecturer: req.body.lecturer6
        }
        const info7 = {
            code : req.body.code7,
            courseName: req.body.courseName7,
            section : req.body.section7,
            lecturer: req.body.lecturer7
        }
        const info8 = {
            code : req.body.code8,
            courseName: req.body.courseName8,
            section : req.body.section8,
            lecturer: req.body.lecturer8
        }
        const info9 = {
            code : req.body.code9,
            courseName: req.body.courseName9,
            section : req.body.section9,
            lecturer: req.body.lecturer9
        }
        const info = [info0,info1,info2,info3,info4,info5,info6,info7,info8,info9];

        if(req.uploadError){
            console.log(req.uploadError )
            res.status(422).render('studentPages/studentNewAbsenceExcuse', {
                hasError : true,
                stuName : stuName,
                stuId : stuId,
                major:major,
                level:level,
                oldData : {
                    dateFrom: dateFrom,
                    dateTo : dateTo,
                    info:info,
                },
                errorMsg : 'Upload Error : file should be in (pdf,jpg,jpeg,png) format and size should be less than 5Mb ;' + req.uploadError.code ,
                layout: 'student',
            })

        }
        else{
            console.log('here')
            // get the file after it was filtered and was successfully uploaded to the server
            const proof = req.file;
            console.log(proof)
            // upload file to AWS S3
        const result = await uploadFile(proof);
            //Delete the file from the server
        await unlinkFile(proof.path)
        console.log(result)
            // get File Key from AWS S3 to save in DB
           const  proofURI = result.Key;

        //save the data in the DB
            const classExcuse = new Excuses ({type:'classAbsence', dateFrom:dateFrom, dateTo: dateTo, status:'pending' , info:info , student:res.user.userId ,proof:proofURI})
            console.log(classExcuse)
            classExcuse.save(function (err, excuse){
                if (err) {
                    return console.error(err);
                }
                res.render('studentPages/studentNewAbsenceExcuse', {
                    hasError : false,
                    stuName : stuName,
                    stuId : stuId,
                    major:major,
                    level:level,
                    oldData : {
                        dateFrom: dateFrom,
                        dateTo : dateTo,
                        info:info,
                    },
                    successMsg : 'Your excuse was sent successfully',
                    layout: 'student',
                })
            });


        }








        // const fileContents = new Buffer(classExcuse.proof.data, 'base64')
        //  fs.writeFileSync(path.join(__dirname + '../../' + '/uploads/' + 'ss.png'), fileContents, (err) => {
        //     if (err) return console.error(err)
        //     console.log('file saved to ')
        // })
        // const dir = path.join( __dirname + '../../'+ 'public'+ '/assets/' + 'img'+ '/'+ 'translation.png');

        // Excuses.findOne({ "name": req.param.image },function(err,champ) {
        //     res.set("Content-Type", champ.contentType);
        //     res.send( champ.img );
        // // });
        // res.set("Content-Type", proof.contentType);
        // res.send( classExcuse.proof.data );

        // res.render('studentPages/studentNewAbsenceExcuse', {
        //     img : classExcuse.proof.data,
        //     proof : proof,
        //     layout: 'student',
        // });

        // res.send('ok')
    }

    // res.render('studentPages/studentNewAbsenceExcuse', {
    //
    //     // imgSrc : dir,
    //     layout: 'student',
    // });
};


//msgto : res.user.advisor_id

exports.messagesend = async (req, res) => {
    const findadvisor = await Students.find({"_id" : `${res.user.userId}`}).populate("advisor_id" , "_id");
    const getinarr =findadvisor[0];
    let thedatenow = new Date();
    let messagerecord = new message({
        msgfrom : res.user.userId ,
        msgto : getinarr.advisor_id._id,
        msgtitel : req.body.Titelmsg,
        msgcontent : req.body.massegContent,
        thetime : `${thedatenow.getHours()}:${thedatenow.getMinutes()}`,
        thedate : `${thedatenow.getDate()}/${thedatenow.getMonth()+1}/${thedatenow.getFullYear()}`
    }); 
    messagerecord.save();

    res.render("studentPages/contactStudentToAdvisor",{
        layout: 'student' 
    })
    
}

exports.submitcomp = async (req, res) => {
    let thedatenow = new Date();
    let complrecord = new Complaint({
        compfrom : res.user.userId ,
        disc : req.body.DisComp,
        prove : "filepath",
        diss : "null",
        dateofdiss : "null",
        dateofsubmit : `${thedatenow.getDate()}/${thedatenow.getMonth()+1}/${thedatenow.getFullYear()}`
    });
    complrecord.save();
    console.log("uploaded sucssec")
    const getstuinfo = await Students.find({"_id" : `${res.user.userId}`}).populate("advisor_id" , "name");
    const getinarr = getstuinfo[0];
    res.render('studentPages/studentNewComplaint', {
        stuname :getinarr.name ,
        stuid : getinarr.id,
        stumajor : getinarr.major,
        stuadvisor : getinarr.advisor_id.name,
        layout: 'student'
    });
    
}

//express imports
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const studentRouter = require("../routes/student.router");
const {renderMyMessages} = require("./student.controller");
// define multer lib


const message = require('../models/messages.model')

// Staf MODEL
const staff = require('../models/staff.model')

// Students MODEL
const Students = require('../models/student.model')

// AdvisorTimes
const AdvisorTimes = require('../models/advisorTimes.model');

// reserved times model
const ReservedTimes = require('../models/ReservedTimes.model');

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


exports.renderMainPage = async (req, res) => {
    const student = await Students.findById(res.user.userId).select("-password").exec();
    res.render('studentPages/studentMain',{
        userName : student.name,
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
        userName : student.name,
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
        userName : student.name,
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
                userName : student.name,
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
                        userName : student.name,
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
                        userName : student.name,
                        editMode : false,
                    });
                }
            });
        }
}



exports.renderContactAdvisor = async (req, res) => {
    const student = await Students.findById(res.user.userId).select("-password").exec();
    res.render('studentPages/contactStudentToAdvisor', {
        userName : student.name,
        layout: 'student'
    });
};

exports.renderMyMessages = async (req, res) => {
  let x = await message.find({"msgto" : `${res.user.userId}`}).populate('msgfrom','name -_id').exec(async function(err,posts){
    const student = await Students.findById(res.user.userId).select("-password").exec();
    let resevedmsg = await message.find({"msgfrom" : `${res.user.userId}`}).populate('msgto','name -_id');
    // ther is ero her that the msg from advisor return null
    if(err){
            res.render('studentPages/studentMessages' , {
                err: err ,
            }); 
            console.log(err);
        }
        else {
         res.render('studentPages/studentMessages' , {
             messagesList : posts.reverse(),
             reseved : resevedmsg.reverse(),
             userName : student.name,
             layout : 'student'
         })      
        } 
  });
  
};


exports.renderBookAppointment = async (req, res) => {

    /**
     * get the student advisor 
     * // 
     */
    let student = await Students.findOne({_id: res.user.userId})

    let sunday=[], monday=[], tuesday=[], wednesday=[], thursday = [];
    let foundTimes = false ;
    let advisorTimes = await AdvisorTimes.findOne({advisor: student.advisor_id})
    // console.log("🚀 ~ file: student.controller.js ~ line 270 ~ advisorTimes", advisorTimes)

    if(advisorTimes){
        foundTimes = true ;
        advisorTimes.sunday.durations.forEach((time,index) => {let obj={}; obj['from']=time.from; obj['to']= time.to; sunday.push(obj)})
        advisorTimes.monday.durations.forEach((time,index) => {let obj={}; obj['from']=time.from; obj['to']= time.to; monday.push(obj)})
        advisorTimes.tuesday.durations.forEach((time,index) => {let obj={}; obj['from']=time.from; obj['to']= time.to; tuesday.push(obj)})
        advisorTimes.wednesday.durations.forEach((time,index) => {let obj={}; obj['from']=time.from; obj['to']= time.to; wednesday.push(obj)})
        advisorTimes.thursday.durations.forEach((time,index) => {let obj={}; obj['from']=time.from; obj['to']= time.to; thursday.push(obj)})
    }
    console.log("🚀 sunday", sunday)
    
    res.render('studentPages/bookAppointment', {
        layout: 'student',
        foundTimes,
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday,
    });
};

// add validation on date on req.body
const datesObject = {
    0: 'sunday',
    1:'monday',
    2:'tuesday',
    3:'wednesday',
    4:'thursday',
    5:'friday',
    6:'saturday',
}
exports.showAvailabilityTimes = async (req, res) => {

    const day = new Date(req.body.date);

    let isValidDate = day instanceof Date && !isNaN(day.valueOf());

    if(!isValidDate){
        return res.status(400).json({msg: 'bad input'});
    }
    let dayNumber = day.getDay();

    if(dayNumber == 5 || dayNumber == 6){
        console.log('holiday');
        return res.status(400).json({msg: 'this day is in weekend'});
    }
    
    let selectedDay = datesObject[dayNumber];

    const student = await Students.findOne({_id:res.user.userId});
    const advisorTimes = await AdvisorTimes.findOne({advisor: student.advisor_id});

    const selectedAdvisorTimes = advisorTimes[selectedDay].durations ;
    
    // based on the day selected will select the day
    let now = day.getTime();
    
    const dayReservedAppointments = await ReservedTimes.find({
        advisor: mongoose.Types.ObjectId(student.advisor_id),
        date: {
            $gte: now,
            $lt: now + (24* 60 * 60 * 1000) -1,
        }
    });
    const availableTime = [];
    for(let obj of selectedAdvisorTimes){
        availableTime.push({from:obj.from, to: obj.to});
        
        for(let reservedDays of dayReservedAppointments){
            if(obj.to == reservedDays.to && obj.from == reservedDays.from){
                console.log('\t\tmatch');
                availableTime.pop();
            }
        }
    }

    res.json({
        day: selectedDay,
        appointments: availableTime,
    })
}

// check the object and see if it has the required params.

exports.bookTimeWithAdvisor = async (req, res) => {

    const student = await Students.findOne({_id:res.user.userId});
    
    let bookedTime = req.body.time; // will have to, from , day
    
    let appointmentDay = new Date(bookedTime.date).getTime();

    let BookedAppointment = {
        student: student._id,
        advisor: student.advisor_id,
        to: bookedTime.to,
        day: bookedTime.day, 
        from: bookedTime.from,
        date: appointmentDay,
    }

    let createdAppointment = await ReservedTimes.create([BookedAppointment]);

    res.json({
        msg: 'you have successfully created appointment',
        appointment: createdAppointment,
    })
}

exports.renderReservedAppointments = async (req, res) => {
    
    let reservedTimes = await ReservedTimes.find({student:res.user.userId}); 

    let appointments = [];
    for(let time of reservedTimes){
        let obj = {};
        obj['isCanceled'] = time.isCanceled;
        obj['accepted'] = time.accepted;
        obj['isCompleted'] = time.isCompleted;
        obj['to'] = time.to;
        obj['from'] = time.from;
        obj['day'] = time.day;
        obj['date'] = (new Date(time.date).toISOString()).split('T')[0];

        appointments.push(obj)
    }
    
    res.render('studentPages/showAppointments', {
        layout: 'student',
        appointments 
    });
};
 

exports.renderUpdateMarks = async (req, res) => {
    const student = await Students.findById(res.user.userId).select("-password").exec();

    res.render('studentPages/studentUpdateMarks', {
        userName : student.name,
        layout: 'student'
    });
};

exports.renderUpdateAbsence = async (req, res) => {
    const student = await Students.findById(res.user.userId).select("-password").exec();
    res.render('studentPages/studentUpdateAbsence', {
        userName : student.name,
        layout: 'student'
    });
};

exports.renderNewComplaint = async (req, res) => {
    let thedatenow = new Date();

    const student = await Students.findById(res.user.userId).select("-password").exec();
    const stuName = student.name;
    const stuId = student.id;
    const major = student.major;
    const level = student.level;
    res.render('studentPages/studentNewComplaint', {
        stuName :stuName ,
        stuId : stuId,
        major : major,
        level :level,
        userName : student.name,
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
        userName : student.name,
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
                    userName : student.name,
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
            const classExcuse = new Excuses ({type:'classAbsence',exam:false, dateFrom:dateFrom, dateTo: dateTo, status:'pending' , info:info , student:res.user.userId ,proof:proofURI})
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
                    userName : student.name,
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

exports.renderGetNewExamExcuse = async (req,res) =>{
    const student = await Students.findById(res.user.userId).select("-password").exec();
    res.render('studentPages/studentNewExamExcuse',{
            stuName : student.name,
            stuId : student.id,
            major : student.major,
            level : student.level,
            userName : student.name,
            layout: 'student'
        });
}



exports.renderPostNewExamExcuse = async (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    } else {
        const student = await Students.findById(res.user.userId).select("-password").exec();
        const stuName = student.name;
        const stuId = student.id;
        const major = student.major;
        const level = student.level;

        const info0 = {
            code: req.body.code0,
            courseName: req.body.courseName0,
            section: req.body.section0,
            lecturer: req.body.lecturer0,
            DOE: req.body.DOE0,
        }
        const info1 = {
            code: req.body.code1,
            courseName: req.body.courseName1,
            section: req.body.section1,
            lecturer: req.body.lecturer1,
            DOE: req.body.DOE1,
        }
        const info2 = {
            code: req.body.code2,
            courseName: req.body.courseName2,
            section: req.body.section2,
            lecturer: req.body.lecturer2,
            DOE: req.body.DOE2,
        }
        const info3 = {
            code: req.body.code3,
            courseName: req.body.courseName3,
            section: req.body.section3,
            lecturer: req.body.lecturer3,
            DOE: req.body.DOE3,
        }
        const info4 = {
            code: req.body.code4,
            courseName: req.body.courseName4,
            section: req.body.section4,
            lecturer: req.body.lecturer4,
            DOE: req.body.DOE4,
        }
        const info5 = {
            code: req.body.code5,
            courseName: req.body.courseName5,
            section: req.body.section5,
            lecturer: req.body.lecturer5,
            DOE: req.body.DOE5,
        }
        const info6 = {
            code: req.body.code6,
            courseName: req.body.courseName6,
            section: req.body.section6,
            lecturer: req.body.lecturer6,
            DOE: req.body.DOE6,
        }
        const info7 = {
            code: req.body.code7,
            courseName: req.body.courseName7,
            section: req.body.section7,
            lecturer: req.body.lecturer7,
            DOE: req.body.DOE7,
        }
        const info8 = {
            code: req.body.code8,
            courseName: req.body.courseName8,
            section: req.body.section8,
            lecturer: req.body.lecturer8,
            DOE: req.body.DOE8,
        }
        const info9 = {
            code: req.body.code9,
            courseName: req.body.courseName9,
            section: req.body.section9,
            lecturer: req.body.lecturer9,
            DOE: req.body.DOE9,
        }
        const info = [info0, info1, info2, info3, info4, info5, info6, info7, info8, info9];

        if (req.uploadError) {
            console.log(req.uploadError)
            res.status(422).render('studentPages/studentNewExamExcuse', {
                hasError: true,
                stuName: stuName,
                stuId: stuId,
                major: major,
                level: level,
                oldData: {
                    info: info,
                },
                errorMsg: 'Upload Error : file should be in (pdf,jpg,jpeg,png) format and size should be less than 5Mb ;' + req.uploadError.code,
                userName : student.name,
                layout: 'student',
            })

        } else {
            // get the file after it was filtered and was successfully uploaded to the server
            const proof = req.file;
            console.log(proof)
            // upload file to AWS S3
            const result = await uploadFile(proof);
            //Delete the file from the server
            await unlinkFile(proof.path)
            console.log(result)
            // get File Key from AWS S3 to save in DB
            const proofURI = result.Key;

            //save the data in the DB
            const classExcuse = new Excuses({
                type: 'ExamAbsence',
                exam: true,
                status: 'pending',
                info: info,
                student: res.user.userId,
                proof: proofURI
            })
            console.log(classExcuse)
            classExcuse.save(function (err, excuse) {
                if (err) {
                    return console.error(err);
                }
                res.render('studentPages/studentNewExamExcuse', {
                    hasError: false,
                    stuName: stuName,
                    stuId: stuId,
                    major: major,
                    level: level,
                    oldData: {
                        info: info,
                    },
                    successMsg: 'Your excuse was sent successfully',
                    userName : student.name,
                    layout: 'student',
                })
            });
        }
    }
    ;
}








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
        userName : student.name,
        layout: 'student' 
    })
    
}

exports.submitcomp = async (req, res) => {
    let thedatenow = new Date();

    const student = await Students.findById(res.user.userId).select("-password").exec();
    const stuName = student.name;
    const stuId = student.id;
    const major = student.major;
    const level = student.level;
    if (req.uploadError) {
        console.log(req.uploadError)
        res.status(422).render('studentPages/studentNewComplaint', {
            hasError: true,
            stuName: stuName,
            stuId: stuId,
            major: major,
            level: level,
            errorMsg: 'Upload Error : file should be in (pdf,jpg,jpeg,png) format and size should be less than 5Mb ;' + req.uploadError.code,
            userName : student.name,
            layout: 'student',
        })

    } else {
        // get the file after it was filtered and was successfully uploaded to the server
        const proof = req.file;
        console.log(proof)
        // upload file to AWS S3
        const result = await uploadFile(proof);
        //Delete the file from the server
        await unlinkFile(proof.path)
        console.log(result)
        // get File Key from AWS S3 to save in DB
        const proofURI = result.Key;

        //save the data in the DB
        const complrecord = new Complaint({
            compfromstudent : res.user.userId ,
            compfromadvisor : null,
            role : false,
            disc : req.body.DisComp,
            prove : proofURI,
            diss : "null",
            dateofdiss : "null",
            dateofsubmit : `${thedatenow.getDate()}/${thedatenow.getMonth()+1}/${thedatenow.getFullYear()}`
        });
        console.log(complrecord)
        complrecord.save(function (err, excuse) {
            if (err) {
                return console.error(err);
            }
            res.render('studentPages/studentNewComplaint', {
                hasError: false,
                stuName: stuName,
                stuId: stuId,
                major: major,
                level: level,
                successMsg: 'Your complain was sent successfully',
                userName : student.name,
                layout: 'student',
            })
        });
    }

   
    console.log("uploaded sucssec")
    const getstuinfo = await Students.find({"_id" : `${res.user.userId}`}).populate("advisor_id" , "name");
    const getinarr = getstuinfo[0];
    res.render('studentPages/studentNewComplaint', {
        stuname :getinarr.name ,
        stuid : getinarr.id,
        stumajor : getinarr.major,
        stuadvisor : getinarr.advisor_id.name,
        userName : student.name,
        layout: 'student'
    });
    
}

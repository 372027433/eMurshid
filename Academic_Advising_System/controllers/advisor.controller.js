
const AbsenceExcuse = require('../models/AbsenceExcuse.model')
const { uploadFile, getFileStream } = require('../utils/s3')

// StudentsAdvisor MODELS
const AdvivsorStudents = require('../models/studentsAdvisor')

//Message MOdel
const message = require('../models/messages.model')

// Students MODELS
const Students = require('../models/student.model')

// Staff MODELS
const Staff = require('../models/staff.model')

// advisor times 
const ReservedTimes = require('../models/ReservedTimes.model')

// Advisor Times Model 
const AdvisorTimes = require('../models/advisorTimes.model')

// Complaint MODEL
const Complaint = require('../models/Complaint.model')

// constants
const TIME_SLOTS = require('../utils/time-slots')
const {TimesArray} = require('../utils/constants')

// const multer = require("multer");
const fs = require('fs');
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)


exports.renderMainPage = async (req, res) => {
    const Ustaff = await Staff.findById(res.user.userId).select("-password").exec();
    console.log(res.user)
    res.render('advisorPages/advisorMain', {
        userName : Ustaff.name,
        layout: 'advisor'
    })
}

exports.renderPersonalProfile = async (req, res) => {

    const Ustaff = await Staff.findById(res.user.userId).select("-password").exec();
    let advisor = await Staff.findById(res.user.userId);

    const advname = advisor.name;
    const advid = advisor.id;
    const advemail = advisor.email;
    
    let advisorinfo ={
        id: advisor.id,
        name :advisor.name,
        email : advisor.email,
        role : advisor.role,
        phone : advisor.phone,
        // faculty_id :advisor.faculty_id
        college :advisor.college
    }
    res.render('advisorPages/advisorProfile', {
        advisor : advisorinfo,
        advname: advname,
        advid: advid,
        adviemail : advemail,
        userName : Ustaff.name,
        layout: 'advisor'
    })
}

exports.renderMyStudents = async (req, res) => {
    const Ustaff = await Staff.findById(res.user.userId).select("-password").exec();
    const studentofadvisor = await AdvivsorStudents.find({ "advisor": `${res.user.userId}` }).populate("students", "-password");
    let x = studentofadvisor[0];
    let y = x.students;

    res.render('advisorPages/advisorMyStudents', {
        studentsad: y,
        userName : Ustaff.name,
        layout: 'advisor'
    })
}

exports.renderRequestReports = async (req, res) => {
    const Ustaff = await Staff.findById(res.user.userId).select("-password").exec();
    res.render('advisorPages/advisorRequestReports', {
        userName : Ustaff.name,
        layout: 'advisor'
    })
}

exports.renderOfficeHours = async (req, res) => {
    try {
        let advisorTimes = await AdvisorTimes.findOne({advisor: res.user.userId}).select('-advisor');
        
        if(!advisorTimes){
            return res.render('advisorPages/advisorOfficeHours', {
                layout: 'advisor',
            })
        };

        let sunday = [], monday = [], tuesday = [], wednesday = [],thursday = [];
        advisorTimes.sunday.time_slots.forEach((time,index) => { let obj = {};  obj['from'] = time.from; obj['to'] = time.to;  obj['id'] = index;  sunday.push(obj); })
        advisorTimes.monday.time_slots.forEach((time,index) => { let obj = {};  obj['from'] = time.from;  obj['to'] = time.to;  obj['id'] = index;  monday.push(obj); })
        advisorTimes.tuesday.time_slots.forEach((time,index) => { let obj = {};  obj['from'] = time.from;  obj['to'] = time.to;  obj['id'] = index;  tuesday.push(obj); })
        advisorTimes.wednesday.time_slots.forEach((time,index) => { let obj = {}; obj['from'] = time.from; obj['to'] = time.to; obj['id'] = index; wednesday.push(obj); })
        advisorTimes.thursday.time_slots.forEach((time,index) => { let obj = {}; obj['from'] = time.from; obj['to'] = time.to; obj['id'] = index; thursday.push(obj); })
   
        res.render('advisorPages/advisorOfficeHours', {
            layout: 'advisor',
            sunday,
            monday,
            tuesday,
            wednesday,
            thursday,
        })
        
    } catch(err) {
        console.log('errors')
        // res.render('errorPage')
    }
}

exports.renderAppointments = async (req, res) => {

    const times = await ReservedTimes.find({advisor: res.user.userId, isCompleted:false })
        .populate([
            {
                path: 'student',
                select: {name: 1,_id:0}
            }
        ])
    
    let arrayOfTimes = [];
    for(let time of times){
        let obj = {
            student: time.student.name,
            day: time.day,
            date: new Date(time.date).toISOString().split('T')[0],
            time: `${time.from} : ${time.to}`,
            id: time._id,
            createdAt: new Date(time.createdAt).toISOString().split('T')[0],
        };        
        arrayOfTimes.push(obj);
    }

    res.render('advisorPages/advisorAppointments', {

        layout: 'advisor',
        times: arrayOfTimes
    })
}

exports.completedAppointment = async(req,res) => {

    const appointmentID = req.body.appointmentId ;
    const appointment = await ReservedTimes.findOne({_id: appointmentID});
    if(!appointment){
        return res.status(400).json({
            msg: 'this appointment is faked'
        })
    }
    const updatedAppointment = await ReservedTimes.updateOne({_id: appointmentID},{isCompleted: true});

    return res.status(200).json({
        data: 'gone and back',
        updatedAppointment

    })
}

exports.renderMessageStudents = async (req, res) => {
    const Ustaff = await Staff.findById(res.user.userId).select("-password").exec();
    const studentofadvisor = await AdvivsorStudents.find({ "advisor": `${res.user.userId}` }).populate("students", "-password");
    let x = studentofadvisor[0];
    let y = x.students;
    res.render('advisorPages/advisorMessageStudents', {
        studentsad: y,
        userName : Ustaff.name,
        layout: 'advisor'
    })
}

exports.renderFindMessage = async (req, res) => {
    const Ustaff = await Staff.findById(res.user.userId).select("-password").exec();
    let x = await message.find({ "msgto": `${res.user.userId}` }).populate('msgfrom', 'name -_id').exec(function (err, posts) {
        // ther is ero her that the msg from advisor return null
        console.log(posts)
        if (err) {
            res.render('advisorPages/advisorFindMessages', {
                err: err,
            });
            console.log(err);
        }
        else {
            res.render('advisorPages/advisorFindMessages', {
                messagesList: posts.reverse(),
                userName : Ustaff.name,
                layout: 'advisor'
            })
        }
    });

}

exports.renderIssueComplaint = async (req, res) => {
    const Ustaff = await Staff.findById(res.user.userId).select("-password").exec();
    let advisor = await Staff.findById(res.user.userId);

    const advname = advisor.name;
    const advid = advisor.id;
    const advemail = advisor.email;
    let advisorinfo ={
        id: advisor.id,
        name :advisor.name,
        email : advisor.email,
        role : advisor.role
    }

    res.render('advisorPages/advisorIssueComplaint', {
        advisorifo : advisorinfo,
        advname: advname,
        advid: advid,
        adviemail : advemail,
        userName : Ustaff.name,
        layout: 'advisor'
    })
}

exports.renderPostResolveExcuses = async (req, res) => {
    const Ustaff = await Staff.findById(res.user.userId).select("-password").exec();
    const excuseId = req.body.exId;
    const advisorComment = req.body.advisorComment;
    if (req.body.hasOwnProperty('recommend')) {
        await AbsenceExcuse.findByIdAndUpdate(excuseId, {
            $set: {
                advisorComment: advisorComment,
                status: 'AdvisorApproved'
            }
        }, { new: true }, (err, doc) => {
            if (err) {
                const errorMsg = err.message
                // res.render('advisorPages/advisorResolveExcuses',{
                //     hasError: true ,
                //     errorMsg: errorMsg ,
                //     layout: 'advisor',
                // })
                res.status('400').redirect('/advisor/resolveExcuses')
            } else {
                // res.render('advisorPages/advisorResolveExcuses',{
                //     hasError: false,
                //     successMsg : 'Excuse was resolved Successfully',
                //     layout: 'advisor',
                // })
                res.status('200').redirect('/advisor/resolveExcuses')
            }
        })
    } else if (req.body.hasOwnProperty('reject')) {
        await AbsenceExcuse.findByIdAndUpdate(excuseId, {
            $set: {
                advisorComment: advisorComment,
                status: 'AdvisorRejected'
            }
        }, { new: true }, (err, doc) => {
            if (err) {
                const errorMsg = err.message;
                // res.render('advisorPages/advisorResolveExcuses',{
                //     hasError: true ,
                //     errorMsg: errorMsg ,
                //     layout: 'advisor',
                // })
                res.status('400').redirect('/advisor/resolveExcuses')
            } else {
                // res.render('advisorPages/advisorResolveExcuses',{
                //     hasError: false,
                //     successMsg : 'Excuse was resolved Successfully',
                //     layout: 'advisor',
                // })
                res.status('200').redirect('/advisor/resolveExcuses')
            }
        })
    }
}

exports.renderGetResolveExcuses = async (req, res) => {
    const Ustaff = await Staff.findById(res.user.userId).select("-password").exec();

    await AbsenceExcuse.find({ status: 'pending' }).populate({ path: 'student', match: { advisor_id: res.user.userId } }).
        exec(function (err, doc) {
            if (err) {
                const errorMsg = err.message
                res.status('400').redirect('advisorPages/advisorResolveExcuses')
                // res.render('advisorPages/advisorResolveExcuses',{
                //     hasError: true ,
                //     errorMsg: errorMsg ,
                //     layout: 'advisor',
                // })
            }
            else {
                res.render('advisorPages/advisorResolveExcuses', {
                    hasError: false,
                    docs: doc,
                    userName : Ustaff.name,
                    layout: 'advisor',
                })
            }
        });

}

exports.renderGetProof = async (req, res) => {
    const Ustaff = await Staff.findById(res.user.userId).select("-password").exec();
    let key = req.params.key
    const readStream = await getFileStream(key)
    await readStream.pipe(res)
}


exports.messagesend = async (req, res) => {
    const Ustaff = await Staff.findById(res.user.userId).select("-password").exec();
    const z = await Students.find({ "id": `${req.body.msgto}` });
    const inarr = z[0];
    let thedatenow = new Date();
    let messagerecord = new message({
        msgfrom: res.user.userId,
        msgto: inarr._id,
        msgtitel: req.body.Titelmsg,
        msgcontent: req.body.massegContent,
        thetime: `${thedatenow.getHours()}:${thedatenow.getMinutes()}`,
        thedate: `${thedatenow.getDate()}/${thedatenow.getMonth() + 1}/${thedatenow.getFullYear()}`
    });
    messagerecord.save();

    const studentofadvisor = await AdvivsorStudents.find({ "advisor": `${res.user.userId}` }).populate("students", "-password");
    let x = studentofadvisor[0];
    let y = x.students;

    res.render('advisorPages/advisorMessageStudents', {
        studentsad: y,
        userName : Ustaff.name,
        layout: 'advisor'
    })

}
exports.createTimeSchedules = async (req, res) => {
    const Ustaff = await Staff.findById(res.user.userId).select("-password").exec();
    try {

        const time = req.body.times;
        const timeSlotDuration = TIME_SLOTS.fifteen;
        let timesArray = {}; // purpose of this array is to store times
        
        for (let key of Object.keys(time)) {
            let dayReservedTimes = time[key] // => key here is the name of the day

            let durationTimesForDay = [] // contain duration times for this day

            for(let i = 0; i < dayReservedTimes.length; i++){

                // to time should always be bigger then from time 
                let fromTime = timeInMinutes(dayReservedTimes[i].from); // start 
                
                let toTime = timeInMinutes(dayReservedTimes[i].to);  // end 15:38
                // let toTime = timeINMinutes('15:38');  // end 15:38

                let numberOfTimeSlots = Math.floor((toTime-fromTime) / timeSlotDuration)
                // we could have some errors, why ??

                let slotFromTime = dayReservedTimes[i].from ;
                let slotHourTime = parseInt(dayReservedTimes[i].from.split(':')[0])
                let slotMinutesTime = parseInt(dayReservedTimes[i].from.split(':')[1])


                /**
                 * @ this loop will calculate the time slot
                 * for example if we have this time { from: '16:30', to: '17:30' }
                 * the durations will be from 
                 * [
                 *  { from: '16:30', to: '16:45'},
                 *  { from: '16:45', to: '17:00'},
                 *  { from: '17:00', to: '17:15'},
                 *  { from: '17:15', to: '17:30'},
                 * ]
                 */

                for(let i = 0; i < numberOfTimeSlots; i++){

                    slotMinutesTime += timeSlotDuration
                    if(slotMinutesTime > 60){ // < check this cond
                        slotHourTime++;
                        slotMinutesTime -= 60 ;
                    }
                    let slotToTime = `${slotHourTime}:${slotMinutesTime == 60 ? slotMinutesTime-1 :slotMinutesTime}`
                    let durationObj = {from: slotFromTime, to:slotToTime }

                    durationTimesForDay.push(durationObj) // this durationTimesForDay
                    slotFromTime = slotToTime
                }

            }
            // here add to DB
            let selectedDay = TimesArray[key]
            if(selectedDay){

                timesArray[selectedDay] = {
                    durations: durationTimesForDay,
                    time_slots: dayReservedTimes,
                }
            }

        }
        timesArray['advisor'] = res.user.userId; // I am not sure of this

        // here we should update the things 
        let foundSchedule = await AdvisorTimes.findOne({advisor: res.user.userId})
        let createSchedule;
        if(!foundSchedule){
            // create 
            createSchedule = await AdvisorTimes.create([timesArray])
        } else {
            // update
            createSchedule = await AdvisorTimes.updateOne({advisor:res.user.userId},timesArray, {new:true})
        }
        

        res.json({ message: 'Every Thing is working' })
    } catch (err) {
        console.log('Errors')
        console.log(err)
        res.send(err)
    }
}

/**
 * return total of mins
 * @param {string} time in form of 'mm:ss'
 */
function timeInMinutes(time){
    // console.log(typeof time)
    
    let totalMin = 0
    let hour = parseInt(time.split(':')[0])
    
    let hours2min = hour * 60 ;

    let min = parseInt(time.split(':')[1])
    totalMin  = hours2min + min
    return totalMin
}


exports.submitcomp = async (req, res) => {
    const Ustaff = await Staff.findById(res.user.userId).select("-password").exec();
    let thedatenow = new Date();

    const advisor = await Staff.findById(res.user.userId).select("-password").exec();
    const advname = advisor.name;
    const advid = advisor.id;
    const advemail = advisor.email;
   
    if (req.uploadError) {
        console.log(req.uploadError)
        res.status(422).render('advisorPages/advisorIssueComplaint', {
            hasError: true,
            advname: advname,
            advid: advid,
            adviemail : advemail,
         
            errorMsg: 'Upload Error : file should be in (pdf,jpg,jpeg,png) format and size should be less than 5Mb ;' + req.uploadError.code,
            userName : Ustaff.name,
            layout: 'advisor',
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
            compfromstudent : null,
            compfromadvisor : res.user.userId ,
            role : true,
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
            res.render('advisorPages/advisorIssueComplaint', {
                hasError: false,
                advname: advname,
                advid: advid,
                adviemail : advemail,
                userName : Ustaff.name,
                successMsg: 'Your complain was sent successfully',
                layout: 'advisor',
            })
        });
    }

    
    console.log("uploaded sucssec")
    const getstuinfo = await Students.find({"_id" : `${res.user.userId}`}).populate("advisor_id" , "name");
    const getinarr = getstuinfo[0];
    res.render('advisorPages/advisorIssueComplaint', {
        advname: advname,
        advid: advid,
        adviemail : advemail,
        userName : Ustaff.name,
        layout: 'advisor'
    });
    
}


exports.renderadvisorshowTheResultOfComplain = async (req, res) => {
    const Ustaff = await Staff.findById(res.user.userId).select("-password").exec();
          
   let complaintforuser = await Complaint.find({"compfromadvisor": `${res.user.userId}`}).populate('compfromstudent', 'name id -_id').populate('compfromadvisor', 'name id -_id');
   // ther is ero her that the msg from advisor return null
  
   let readydata = [] ;
   for(let c = 0 ; c < complaintforuser.length;c++){
     let tempobj ={};
     tempobj = complaintforuser[c];
     
     let obj={
       Complaintid:tempobj._id,
      compfromstudent_id : tempobj.compfromstudent?.id ? tempobj.compfromstudent?.id : 'a6s5d4f6as54df64a' ,
      compfromstudent_name : tempobj.compfromstudent?.name ? tempobj.compfromstudent.name : "khaled student",
      compfromadvisor_id : tempobj.compfromadvisor?.id? tempobj.compfromadvisor.id : 'sd6f46sa54df987sdf' ,
      compfromadvisor_name : tempobj.compfromadvisor?.name ? tempobj.compfromadvisor.name : 'saliem advisor',
      role : tempobj.role,
      disc : tempobj.disc,
      prove : tempobj.prove,
      dateofsubmit : tempobj.dateofsubmit,
      diss : tempobj.diss,
      dateofdiss : tempobj.dateofdiss
     };
     readydata.push(obj);       

   }


    //**************************************** */
    console.log(complaintforuser);
        res.render('advisorPages/advisorshowTheResultOfComplain', {
        compList: readydata.reverse(),
        userName : Ustaff.name,
        layout: 'advisor'
    })
}
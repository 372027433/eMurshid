/// EXTERNAL LIBRARIES
const generator = require("generate-password")
const excelReader = require("read-excel-file/node")
const nodemailer = require("nodemailer")
const sgTransport = require("nodemailer-sendgrid-transport")
const bcrypt = require('bcrypt')

/// NODE CORE LIBRARIES
const path = require("path")

/// DATABASE MODELS
const Students = require('../models/student.model')
const Staff = require('../models/staff.model')
const AdvivsorStudents = require('../models/studentsAdvisor')

// functions and libraries
const roles = require('../utils/roles')
const college = require('../utils/facultyType')

// util Functions
const {passwordGenerator} = require('../utils/generatePassword');
const {emailAndPasswordTemplateEmail} = require('../utils/emailAndPasswordTemplateEmail');
const AbsenceExcuse = require("../models/AbsenceExcuse.model");
const {getFileStream} = require("../utils/s3");

// SENDER EMAIL CONFIGURED IN SEND_GRID
const SENDGRID_SENDER_EMAIL = 'emurshid.iu@gmail.com'


let transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_TRANSPORT,
    },
  })
);

/**
 * ===================== CONTROLLERS ==================
 */

//****************  get req controllers ***************************//
exports.renderMainPage = (req, res) => {
  res.render("advisingUnitPages/advisingUnitMain", {
    layout: "advisingUnit",
  });
};

exports.renderCollageStudents = (req, res) => {
  res.render("advisingUnitPages/aauCollageStudents", {
    layout: "advisingUnit",
  });
};

exports.renderGetResolveExcuses = async (req, res) => {
   await AbsenceExcuse.find({status:'AdvisorApproved'}).populate({path :'student'}).
  exec(function (err, doc) {
    if (err) {
      res.render('advisingUnitPages/aauResolveExcuses',{
        hasError: true ,
        errorMsg: err.message ,
        layout: 'advisingUnit',
      })
    }else{
    res.render('advisingUnitPages/aauResolveExcuses',{
      hasError:false,
      docs:doc,
      layout: 'advisingUnit',
    })
    }
  });
};

exports.renderPostResolveExcuses = async (req, res) => {
  const excuseId = req.body.exId;
  const aauComment = req.body.aauComment;
  if (req.body.hasOwnProperty('recommend')) {
     await AbsenceExcuse.findByIdAndUpdate(excuseId, {
      $set: {
        aauComment: aauComment,
        status: 'aauApproved'
      }
    }, {new: true}, (err, doc) => {
      if (err) {
        // res.render('advisingUnitPages/aauResolveExcuses',{
        //   hasError: true ,
        //   errorMsg: err.message ,
        //   layout: 'advisingUnit',
        // })
        res.status('400').redirect('/advisingUnit/resolveExcuses')
      } else {
        // res.render('advisingUnitPages/aauResolveExcuses',{
        //   hasError: false,
        //   successMsg : 'Excuse was resolved Successfully',
        //   layout: 'advisingUnit',
        // })
        res.status('200').redirect('/advisingUnit/resolveExcuses')
      }
    })
  } else if (req.body.hasOwnProperty('reject')) {
     await AbsenceExcuse.findByIdAndUpdate(excuseId, {
      $set: {
        aauComment: aauComment,
        status: 'aauRejected'
      }
    }, {new: true}, (err, doc) => {
      if (err) {
        // res.render('advisingUnitPages/aauResolveExcuses',{
        //   hasError: true ,
        //   errorMsg: err.message ,
        //   layout: 'advisingUnit',
        // })
        res.status('400').redirect('/advisingUnit/resolveExcuses')

      } else {
        // res.render('advisingUnitPages/aauResolveExcuses',{
        //     hasError: false,
        //     successMsg : 'Excuse was resolved Successfully',
        //     layout: 'advisingUnit',
        // })
        res.status('200').redirect('/advisingUnit/resolveExcuses')
      }
    })
  }
};

exports.renderGetProof = async (req , res)=>{
  let key = req.params.key
  const readStream =  await getFileStream(key)
  await readStream.pipe(res)
}


exports.renderStudentRegisterPage = (req, res) => {
  res.render("advisingUnitPages/registerStudents", {
    layout: "advisingUnit",
  });
};

exports.renderRegisterAdvisors = (req, res) => {
  res.render("advisingUnitPages/aauRegisterAdvisors", {
    layout: "advisingUnit",
  });
};

// ======================================================================
// ======================================================================
// ======================================================================

/**
 * validate name
 * some view ideas it to remove the msg after 5 sec for exmaple
 * @param {*} req 
 * @param {*} res 
 */
exports.registerAdvisors = async (req, res) => {

  // passwordGenerator();
  const {name, id} = req.body ;
  // console.log()
  // check from user Id
  if(/^[0-9]{1,8}$/.test(id)){

    const userObj = {};
    userObj.name = name ;
    
    let salt = bcrypt.genSaltSync(10); 
    let hashedPassword = bcrypt.hashSync(id, salt)
    userObj.password = hashedPassword ;

    userObj.id = id;
    userObj.faculty_id = res.user.faculty;
    
    userObj.email = `${id}@iu.edu.sa`;
    userObj.role = roles.advisor;

    // check if user exists in DB
    let userRegistered;
    try{
      userRegistered = await Staff.findOne({id: userObj.id});
    } catch(e){
      return res.render("advisingUnitPages/aauRegisterAdvisors", {
        layout: "advisingUnit",
        errorMsg: "There is a user with this ID"
      });
    }
    if(!userRegistered) {
      /// CREATE USER IN DB
      try {
        // now submit to Staff DB
        let createdAdvisor = await Staff.create(userObj)

        // create a advisor in assignation list
        await AdvivsorStudents.create({advisor: createdAdvisor._id })
        
        createdAdvisor.validate();
      } catch(e) {
        // res.status(500).render() // should render an error page
        return res.render("advisingUnitPages/aauRegisterAdvisors", {
          layout: "advisingUnit",
          errorMsg: e
        });
      }

      // /// SEND EMAIL TO USER EMAIL
      // const output = emailAndPasswordTemplateEmail(userObj.email,userObj.passwordToSend );
      // /// transporter
      // let mailOptions = {
      //   from: `"Academic Advising Unit at Islamic University" <${SENDGRID_SENDER_EMAIL}>`, // sender address 
      //   to: `${userObj.id}@iu.edu.sa`, // list of receivers
      //   subject: "Advisor Registeration in Academic Advising",
      //   html: output,
      // };
      // transporter.sendMail(mailOptions, (err, info) => {
      //   if (err) {
      //     // if an is not sent
      //     console.log(info) 
      //   } 
      // });

      return res.render("advisingUnitPages/aauRegisterAdvisors", {
        layout: "advisingUnit",
        successMsg: "User Registered Successfuly"
      });

    } else {
      // we have a user with this id     
      return res.render("advisingUnitPages/aauRegisterAdvisors", {
        layout: "advisingUnit",
        errorMsg: "There is a user with this ID"
      });
    }

  } else {
    return res.render("advisingUnitPages/aauRegisterAdvisors", {
      layout: "advisingUnit",
      errorMsg: "ID should be less then 9 characters"
    });
  }
};

exports.renderAssignStudentsToAdvisors = async (req, res) => {

  // get all list of advisors
  let advisors = await Staff.find({faculty_id:res.user.faculty, role: roles.advisor})
  let students = await Students.find({faculty_id:res.user.faculty}, 'id name status advisor_id')

  let unassignedStudents = [];
  for(let i = 0; i< students.length; i++){
    if(students[i].advisor_id == undefined){
      unassignedStudents.push({...students[i]})
    }
  }
  let noStudents = false ;
  if(unassignedStudents.length <= 0) noStudents = true ;

  // now present the student

  res.render("advisingUnitPages/aauAssign", {
    layout: "advisingUnit",
    advisorList: advisors,
    isThereStudents: noStudents , 
    studentsList: unassignedStudents,
  });
};

exports.assignStudentsToAdvisors =  async (req, res) => {

  const advisorID = req.body.data.advisor
  
  const { studentsMongoId,
    studentId} = req.body.data

    console.log('mogo',studentsMongoId)
    console.log("studentId: ",studentId)
  try {
    let a = await AdvivsorStudents.findOne({advisor: advisorID})
    console.log(a.students)
    a.students = [...a.students, ...studentsMongoId]
    a.save();

  } catch(e){
    return res.status(400).json({error: e})
  }

  studentId.forEach( async (id) => {
    
    await Students.update( {id:id}, {
      $set: {advisor_id: advisorID}
    })

  })
 
  return res.status(200).json({data:studentId})

}

//*********************************************************************//



/**
 * some work need to be done
 * add 
 * -FACULITY_ROLE to object ==>> added 
 * -Handle errors
 * -
 */
/**
 * delete the email sending (done)
 * delete password generating (done)
 * if student already regis then ignore him and inform (done)
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.registerStudents = async (req, res) => {
  // we should have the faculity of the faculity member;
  console.log(res.user.role)

  let { filename } = req.file;
  let filepath = path.join(__dirname, "..", "uploads", filename);

  let info = excelReader(filepath).then( async (rows) => {
    // creating student credential .Phase-1
    let studentRecords = [];

    if(rows[0][0].toLocaleLowerCase() !== 'students' || rows[0][1].toLocaleLowerCase() !== 'id' ){
      // checking file structure
      // console.log('error')
      throw new Error('file not formatted correctly')
    }
    for (let i = 1; i < rows.length; i++) {
      let studentID = rows[i][1].toString();

      // let generatedPassword = generator.generate({
      //   length: 10,
      //   numbers: true,
      // });
      let hashedPassword = await bcrypt.hash(studentID, 10)

      studentRecords.push({
        name: rows[i][0],
        id: studentID,
        role: roles.student,
        password: hashedPassword,
        // toBeSentThenDeletedPassword: generatedPassword,
      });
    }
    return studentRecords;
    
  });

  info.then((records) => {
    // Adding additional info to student object .Phase-2
    if (records.length <= 0) return res.status(400).send("not enouph students"); // <- this method is wrong . should use .render

    // create user
    let bulkStudentWrite = [];
    for (record of records) {
      let obj = JSON.parse(JSON.stringify(record));
      obj.faculty_id = res.user.faculty,
      obj.email = `${record.id}@stu.iu.edu.sa`;
      obj.status = "undergraduate";
      bulkStudentWrite.push(obj);
    }

    return bulkStudentWrite;
  })


  .then( async (studentRecords) => {

    /**
     * check on studdents
     * when finished pass the array to view as param
     */
    // what does .map do 

    let registeredStudents = [];
    for(let student of studentRecords){

      let studentFound = await Students.findOne({id: student.id}).exec();
      if(Boolean(studentFound)){
        // console.log('we have studentest', student.id)
        registeredStudents.push(studentFound);
        continue 
      } else {
        // here create the student 

        let userInsert = await Students.create(student)
 
        // console.log('inserted user', userInsert)
      }

    }
    return registeredStudents

  })
  .then((registeredStudents) => {
    // redirect to same page with info .Phase-5
    
    let displayInfo = registeredStudents.length > 0 ;
    
    res.render("advisingUnitPages/registerStudents", {
      layout: "advisingUnit",
      successMsg: 'Students are added',
      displayRegistered: displayInfo,
      registeredStudents: registeredStudents, 
    });
  })

  info.catch(err => {
    // Catch errors 
    // SHOULD RENDER TO AN ERROR PAGE
    res.status(400).json({err:"file not formatted correctly"})
  })
};

async function doSomething(){

}


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
const Courses =  require('../models/courses.model')
const Majors =  require('../models/majors.model')
const Semesters = require('../models/semesters.models')


// functions and libraries
const roles = require('../utils/roles')
const college = require('../utils/facultyType')

// util Functions
const {passwordGenerator} = require('../utils/generatePassword');
const {emailAndPasswordTemplateEmail} = require('../utils/emailAndPasswordTemplateEmail');
const AbsenceExcuse = require("../models/AbsenceExcuse.model");
const {getFileStream} = require("../utils/s3");
const util = require("util");
const fs = require("fs");
const Excuses = require("../models/AbsenceExcuse.model");

// SENDER EMAIL CONFIGURED IN SEND_GRID
const SENDGRID_SENDER_EMAIL = 'emurshid.iu@gmail.com'


let transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_TRANSPORT,
    },
  })
);

//
const unlinkFile = util.promisify(fs.unlink)

/**
 * ===================== CONTROLLERS ==================
 */

//****************  get req controllers ***************************//
exports.renderMainPage = (req, res) => {
  res.render("advisingUnitPages/advisingUnitMain", {
    layout: "advisingUnit",
  });
};

exports.renderCollegeStudents = async (req, res) => {
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

    res.render("advisingUnitPages/aauCollegeStudents", {
      layout: "advisingUnit",
      students: students, 
    });
    
  } catch(e){
      res.status(400).json({msg: 'error happening' + e})
  }
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
  // check from user Id
  if(/^[0-9]{1,8}$/.test(id)){

    const userObj = {};
    userObj.name = name ;
    
    let salt = bcrypt.genSaltSync(10); 
    let hashedPassword = bcrypt.hashSync(id, salt)
    userObj.password = hashedPassword ;

    userObj.id = id;
    userObj.faculty_id = res.user.faculty;
    userObj.college = res.user.college;
    
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
      // obj.faculty_id = res.user.faculty,
      obj.college =  res.user.college,
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



exports.renderPostAddCourses = (req,res)=>{

  let { filename } = req.file;
  let filepath = path.join(__dirname, "..", "uploads", filename);

  let info = excelReader(filepath).then( async (rows) => {
    // creating student credential .Phase-1
    let coursesRecords = [];

    if(rows[0][0].toLocaleLowerCase() !== 'code' || rows[0][1].toLocaleLowerCase() !== 'name' || rows[0][2].toLocaleLowerCase() !== 'hours'|| rows[0][3].toLocaleLowerCase() !== 'major1' || rows[0][4].toLocaleLowerCase() !== 'major2' ){
      // checking file structure
      // console.log('error')
      throw new Error('file not formatted correctly')
    }

    for (let i = 1; i < rows.length; i++) {
      let code = rows[i][0].toString();
      let name = rows[i][1].toString();
      let hours = rows[i][2].toString();
      let major1 ;
      let major2;
      if(rows[i][3]!=null){
        major1 = rows[i][3].toString();
      }
      if(rows[i][4]!=null){
        major2 = rows[i][4].toString();
      }


      // let majorsArr =[]
      //  await Majors.find({code:major1, code: major2}),(err,major)=>{
      //   if(err){
      //     throw new Error(`major for ${code} wasn't found in Database`)
      //   }else {
      //     majorsArr.push(major.id)
      //   }
      //  }

      const major = await Majors.find({$or:[{code: major1},{code:major2}]}).select("_id").exec()
      if (major) {
        coursesRecords.push({
          code: code,
          name: name,
          hours: hours,
          major: major,
          college : res.user.college
        });
      }
      else{
        throw new Error(`major for ${code} wasn't found in Database`)
        }

     //    await Majors.find({$or:[{code: major1},{code:major2}]},(err,major)=>{
     //   console.log('major:->'+coursesRecords)
     //   if(err){
     //     console.log(err.msg)
     //     throw new Error(`major for ${code} wasn't found in Database`)
     //   }else {
     //     coursesRecords.push({
     //       code: code,
     //       name: name,
     //       hours: hours,
     //       major: major,
     //     });
     //     console.log('coursesRecords:->'+coursesRecords)
     //   }
     // })
    }
    return coursesRecords;

  });

  info.then((records) => {
    console.log('records:->'+records)
    // Adding additional info to student object .Phase-2
    if (records.length <= 0) return res.status(400).send("not enough courses"); // <- this method is wrong . should use .render

    // create user
    // let bulkStudentWrite = [];
    // for (record of records) {
    //   // let obj = JSON.parse(JSON.stringify(record));
    //   record.code = res.user.faculty,
    //       obj.email = `${record.id}@stu.iu.edu.sa`;
    //   obj.status = "undergraduate";
    //   bulkStudentWrite.push(obj);
    // }

    // return bulkStudentWrite;
  })


      info.then( async (records) => {


        let registeredCourses = [];
        for(let course of records){
          let courseFound = await Courses.findOne({code: course.code}).exec();
          if(Boolean(courseFound)){
            registeredCourses.push(courseFound);
          } else {
            // here create the course
            console.log('creating')
             await Courses.create(course)

            // console.log('inserted user', userInsert)
          }

        }
        return registeredCourses

      })
      .then(async (registeredCourses) => {
        // redirect to same page with info .Phase-5

        let displayInfo = registeredCourses.length > 0 ;
        await unlinkFile(filepath)
        res.render("advisingUnitPages/aauAddCourses", {
          layout: "advisingUnit",
          successMsg: 'courses are added',
          displayRegistered: displayInfo,
          registeredCourses: registeredCourses,
        });
      })

  info.catch(err => {
    // Catch errors
    // SHOULD RENDER TO AN ERROR PAGE
    res.status(400).json({err:"file not formatted correctly"})
  })
};

exports.renderGetAddCourses = async (req, res) => {
  res.render("advisingUnitPages/aauAddCourses", {
    layout: "advisingUnit",
  });
};

exports.renderGetShowCourses = async (req, res) => {
  try{
    console.log(res.user)
    let courses = await Courses.find({}).populate('major')
    const coursesArr = []
    for(let course of courses){
      let courseObj = {}
      courseObj['name'] = course.name
      courseObj['code'] = course.code
      courseObj['hours'] = course.hours
      //check if major is undefined or not, add all related majors codes
      let tempMajor = "";
      for (let i =0 ; i<course.major.length ; i++){
          if(typeof course.major[i] !== 'undefined' ) {
            tempMajor += ' ' + course.major[i].code.toString()
      }
      }
      courseObj['major'] =  tempMajor;
      coursesArr.push(courseObj)

    }

    res.render("advisingUnitPages/aauShowCourses", {
      layout: "advisingUnit",
      courses: coursesArr,
    });

  } catch(e){
    res.status(400).json({msg: 'error happening' + e})
  }
};



exports.renderGetManageMajors = async (req, res) => {
  try{
    console.log(res.user.college)
    let majors = await Majors.find({college : res.user.college}).exec()
    const majorsArr = []
    for(let major of majors){
      let majorObj = {}
      majorObj['name'] = major.name
      majorObj['code'] = major.code

      majorsArr.push(majorObj)
    }

    res.render("advisingUnitPages/aauManageMajors", {
      layout: "advisingUnit",
      majors: majorsArr,
    });
  } catch(e){
    res.status(400).json({msg: 'error happening' + e})
  }
};

// to be modified
exports.renderPostManageMajors = async (req, res) => {
  if(!req.body){
    return res.sendStatus(400);
  }
  else if(req.body.hasOwnProperty("addMajor")) {
  }
  else if(req.body.hasOwnProperty("deleteMajor")) {
  }
  }


exports.renderGetManageSemesters = async (req, res) => {
  // let d = new Date(Date.now());
  //
  // console.log(  d.toString())

console.log(res.user)

  res.render("advisingUnitPages/aauManageSemesters", {
    layout: "advisingUnit",
  });
}


exports.renderPostManageSemesters = async (req, res) => {
  try {
    console.log(req.body.period)
    //check body
    if (!req.body) {
      return res.sendStatus(400);
    }
    //validate selection
    if (req.body.period === 'Period') {
      throw new Error('period not Selected')
    }
    //on add btn click
    else if (req.body.hasOwnProperty("addSemester")) {
      //get hijri date to generate code
      let GregorianYear = (new Date()).getFullYear();
      let HijriYear = Math.trunc((GregorianYear - 622) * (33 / 32));
      let startDate = req.body.startDate
      let endDate = req.body.endDate
      let period = req.body.period
      //get last two digits of hijri date and add period value to it ex 1441 + summer = 413
      let code = HijriYear.toString().substring(2) + period


      const semesterExist = await Semesters.exists({code:code})
      if(semesterExist){
        throw new Error('semester already Exits')
      }
      //create doc
      const classSemester = await new Semesters({startDate: startDate, endDate: endDate, code: code})
      //save doc
      classSemester.save(function (err, excuse) {
        if (err) {
          throw new Error(err.message)
        }
        res.render('advisingUnitPages/aauManageSemesters', {
          hasError: false,
          successMsg: 'Semester was added successfully',
          layout: 'advisingUnit',
        })
      });
    }
    //delete Btn click
  else if (req.body.hasOwnProperty("deleteMajor")) {
    res.render("advisingUnitPages/aauManageSemesters", {
      layout: "advisingUnit",
    });
    }
  } catch(e){
      res.render("advisingUnitPages/aauManageSemesters", {
        hasError: true,
        errMsg: e.message,
        layout:"advisingUnit"
    });

    }

}









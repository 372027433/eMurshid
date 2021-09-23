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

// functions and libraries
const roles = require('../utils/roles')

// util Functions
const {passwordGenerator} = require('../utils/generatePassword');
const {emailAndPasswordTemplateEmail} = require('../utils/emailAndPasswordTemplateEmail');

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

exports.renderResolveExcuses = (req, res) => {
  res.render("advisingUnitPages/aauResolveExcuses", {
    layout: "advisingUnit",
  });
};

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
 * change reciever email to advisorEmail, after confirm its structure
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
    userObj.passwordToSend = passwordGenerator();
    
    let salt = bcrypt.genSaltSync(10); 
    let hashedPassword = bcrypt.hashSync(userObj.passwordToSend, salt)
    userObj.password = hashedPassword ; 

    userObj.id = id;
    userObj.faculty_id = '';
    
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
        let valDB = await Staff.create(userObj)

        // here you validate the schema
        valDB.validate();
      } catch(e) {
        // res.status(500).render() // should render an error page
        return res.render("advisingUnitPages/aauRegisterAdvisors", {
          layout: "advisingUnit",
          errorMsg: e
        });
        // res.status(500).json({error:e})
      }

      /// SEND EMAIL TO USER EMAIL
      const output = emailAndPasswordTemplateEmail(userObj.email,userObj.passwordToSend );
      /// transporter
      let mailOptions = {
        from: `"Academic Advising Unit at Islamic University" <${SENDGRID_SENDER_EMAIL}>`, // sender address 
        to: "372027433@stu.iu.edu.sa", // list of receivers
        subject: "Advisor Registeration in Academic Advising",
        html: output,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          // if an is not sent
          console.log(info) 
        } 
      });

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

exports.renderAssignStudentsToAdvisors = (req, res) => {
  res.render("advisingUnitPages/aauAssign", {
    layout: "advisingUnit",
  });
};

//*********************************************************************//



/**
 * some work need to be done
 * add 
 * -FACULITY_ROLE to object
 * -Handle errors
 * -inform advisingUnit member that we have finished sending emails and they are successful
 * -
 */
exports.registerStudents = (req, res) => {

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
      let generatedPassword = generator.generate({
        length: 10,
        numbers: true,
      });
      let hashedPassword = await bcrypt.hash(generatedPassword, 10)

      studentRecords.push({
        name: rows[i][0],
        id: rows[i][1],
        role: roles.student,
        password: hashedPassword,
        toBeSentThenDeletedPassword: generatedPassword,
      });
    }
    return studentRecords;
    
  });
  info.then((records) => {
    // Adding additional info to student object .Phase-2
    if (records.length <= 0) return res.status(400).send("not enouph students");

    // create user
    let bulkStudentWrite = [];
    for (record of records) {
      let obj = JSON.parse(JSON.stringify(record));
      obj.faculty_id = '', // should be taken from advisingUnit
      obj.email = `${record.id}@stu.iu.edu.sa`;
      obj.status = "undergraduate";
      bulkStudentWrite.push(obj);
    }

    return bulkStudentWrite;
  })
  .then((studentRecords) => {
    // sending email .Phase-3
    let notSentEmails = [] // used to handle errors with emails that are not sent

    studentRecords.forEach((student) => {
      let {email,toBeSentThenDeletedPassword} = student ;
      const output = emailAndPasswordTemplateEmail(email,toBeSentThenDeletedPassword );
      /// transporter
      let mailOptions = {
        from: `"Academic Advising Unit at Islamic University" <${SENDGRID_SENDER_EMAIL}>`, // sender address 
        to: email, // list of receivers
        subject: "Student Registeration in Academic Advising",
        html: output,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) { 
          // if an is not sent
          notSentEmails.push(email)
          console.log(err) 
        } 
        // if(info.message == 'success'){
        //   console.log('\tSuccessful sending..!')
        // }
      });
      // delete the plainText password from object
      delete student.toBeSentThenDeletedPassword
    });
    return studentRecords
  })
  .then(result => {
    // creating students in DB .Phase-4
    return new Promise((resolve, reject) => {
      Students.create(result, (err, data) => {
        if(err) reject( new Error('We could not enter the database') )
        resolve(data)
      })
    })
  })
  .then(() => {
    // redirect to same page .Phase-5
    res.render("advisingUnitPages/registerStudents", {
      layout: "advisingUnit",
    });
  })

  info.catch(err => {
    // Catch errors 

    res.status(400).json({err:"file not formatted correctly"})
  })
};




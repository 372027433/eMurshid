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

// functions and libraries
const roles = require('../utils/roles')

// SENDER EMAIL CONFIGURED IN SEND_GRID
const SENDER_EMAIL = 'emurshid.iu@gmail.com'


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

exports.renderMainPage = (req, res) => {
  res.render("advisingUnitPages/advisingUnitMain", {
    layout: "advisingUnit",
  });
};


exports.renderStudentRegisterPage = (req, res) => {
  res.render("advisingUnitPages/registerStudents", {
    layout: "advisingUnit",
  });
};

/**
 * some work need to be done
 * add 
 * -FACULITY_ROLE to object
 * -Handle errors
 * -inform advisingUnit member that we have finished sending emials and they are successful
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
      console.log('error')
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

      const output = `
          <h1>Welcome to Academic Advising In Islamic University</h1>
          <div> <h2>you have been registered at Academic Advising Unit</h2></div>
          <div><h4>email: <b>${email}</b></h4></div>
          <div><h4>Password: <b>${toBeSentThenDeletedPassword}</b></h4></div>

          <p> Ignore this message if you don't know what it mean </p>
      `;
      /// transporter
      let mailOptions = {
        from: `"Academic Advising Unit at Islamic University" <${SENDER_EMAIL}>`, // sender address 
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
    // console.log("Not sent emails: ")
    // console.log(notSentEmails)
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
    console.log("============== err ====================")
    console.log(err)
    res.status(400).json({err:"file not formatted correctly"})
  })
};


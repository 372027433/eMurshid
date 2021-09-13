const generator = require("generate-password");
const excelReader = require("read-excel-file/node");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const path = require("path");

const Students = require('../models/student.model')

// SENDER EMAIL USED IN SEND_GRID
const SENDER_EMAIL = 'emurshid.iu@gmail.com';

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

exports.registerStudents = (req, res) => {

  let { filename } = req.file;
  let filepath = path.join(__dirname, "..", "uploads", filename);

  let info = excelReader(filepath).then((rows) => {
    // create a studentRecords here
    let studentRecords = [];
    // here I should check the structure of the file

    if(rows[0][0].toLocaleLowerCase() !== 'students' || rows[0][1].toLocaleLowerCase() !== 'id' ){
      console.log('error')
      throw new Error('file not formatted correctly')
    }
    for (let i = 1; i < rows.length; i++) {
      let password = generator.generate({
        length: 10,
        numbers: true,
      });
      studentRecords.push({
        name: rows[i][0],
        id: rows[i][1],
        password,
      });
    }
    return studentRecords;
    
  });
  info.then((records) => {
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

    let notSentEmails = []

    studentRecords.forEach((student) => {
      let {email,password} = student ;

      const output = `
          <h1>Welcome to Academic Advising In Islamic University</h1>
          <div> <h2>you have been registered at Academic Advising Unit</h2></div>
          <div><h4>email: <b>${email}</b></h4></div>
          <div><h4>Password: <b>${password}</b></h4></div>

          <p> Ignore this message if you don't know what it mean </p>
      `;
      /// transporter
      let mailOptions = {
        from: `"Abdullah Salim Basalamah" <${SENDER_EMAIL}>`, // sender address 
        to: email, // list of receivers
        subject: "Node mailing service ✔",
        html: output,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) { 
          // if an is not sent
          notSentEmails.push(email)

          console.log(err) 
        } 

      });
    });
    return studentRecords
  })
  .then(result => {
    console.log(result)
    return new Promise((resolve, reject) => {
      console.log(result)
      Students.create(result, (err, data) => {
        if(err) reject( new Error('We could not enter the database') )
        console.log('if this after, this will not good')
        resolve(data)
  
      })
    })
  })
  .then((result) => {
    console.log('are we sending to database')
    res.render("advisingUnitPages/registerStudents", {
      layout: "advisingUnit",
    });
  })

  info.catch(err => {
    console.log("============== err ====================")
    console.log(err)
    res.status(400).json({err:"file not formatted correctly"})
  })
  /**
   * here student should be added to system
   * 1- the sheet file should be read using some third party library
   * 2- create password for each student
   * 3- add student to DB , if student could not be created this means it's used, should be deleted or reset has password
   * 4- send the password to student via email <- using third party library
   */

  // I should add a message here
  
};

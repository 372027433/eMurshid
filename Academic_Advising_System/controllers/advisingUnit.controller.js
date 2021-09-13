const generator = require("generate-password");
const excelReader = require("read-excel-file/node");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const path = require("path");
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
  console.log(req.body);
  console.log(req.file);
//   let { filename } = req.file;
//   let filepath = path.join(__dirname, "..", "uploads", filename);

//   let info = excelReader(filepath).then((rows) => {
//     // create a studentRecords here
//     let studentRecords = [];

//     for (let i = 1; i < rows.length; i++) {
//       // i starts from 1 because first line is heading in the file so ignore it
//       let password = generator.generate({
//         length: 10,
//         numbers: true,
//       });
//       studentRecords.push({
//         name: rows[i][0],
//         id: rows[i][1],
//         password,
//       });
//     }
//     console.log(studentRecords);
//     return studentRecords;
//   });

  /**
   * here student should be added to system
   * 1- the sheet file should be read using some third party library
   * 2- create password for each student
   * 3- add student to DB , if student could not be created this means it's used, should be deleted or reset has password
   * 4- send the password to student via email <- using third party library
   */

  // I should add a message here
  res.render("advisingUnitPages/registerStudents", {
    layout: "advisingUnit",
  });
};

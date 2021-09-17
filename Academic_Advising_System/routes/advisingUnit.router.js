/**
 * This file handles all the routes for the advising unit  
*/

const advisingUnitRouter = require('express').Router();
const multer = require("multer");
const path = require('path')

const controller = require('../controllers/advisingUnit.controller');

// configure the storage place
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', "uploads"),
  filename: function (req, file, cb) {
    // cb means 'c'all 'b'ack
    let fileOriginalName = file.originalname.split(".")[0];
    cb(
      null,
      `${fileOriginalName}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

//                \/ for different sizes modify here
const sizeLimit = 1 * 1024 * 1024; // 1MB

// dest: path.join(__dirname,'..','uploads'),
const upload = multer({
  storage: storage,
//   limits: {
//       fileSize: sizeLimit
//   },
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb);
//   },
}).single('students_register_file');

const checkFileType = (file, cb) => {
    // check the file ext name and pass it to allow type function
    // and check mime type 
    const allowedTypes = /xlsx|xls/;
    const allowedMimeTypes = /openxmlformats|ms-excel/;
    const extName = allowedTypes.test(path.extname(file.originalname));
    const mimeType = allowedMimeTypes.test(file.mimetype);
    console.log(extName, "---", mimeType);
    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb("excel files only with .xlsx or .xls...!");
    }
};

advisingUnitRouter.get('/', controller.renderMainPage)

advisingUnitRouter.get('/registerStudents', controller.renderStudentRegisterPage)

// here we need to create the form to fill students then we can add new students to the system
advisingUnitRouter.post('/registerStudents', upload, controller.registerStudents)

module.exports = advisingUnitRouter ;
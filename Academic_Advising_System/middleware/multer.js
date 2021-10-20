const multer = require("multer");


const fileStorage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'uploads')
    },
    filename : (req,file,cb)=>{
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    },
});

const fileFilter = (req,file,cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ||  file.mimetype === 'application/pdf'){
        cb(null,true)
    }
    else {
        cb(null,false)
    }

}
const upload = multer({
    storage:fileStorage,
    fileFilter:fileFilter,
    limits:{fileSize: 3*1024*1024 }
})
const uploader = upload.single('file')

// function checkMulter(req, res) {
//     uploader(req, res, function (err) {
//         if (err instanceof multer.MulterError) {
//             // A Multer error occurred when uploading.
//             console.log(err)
//         } else if (err) {
//             // An unknown error occurred when uploading.
//         }
//
//         // Everything went fine and save document in DB here.
//     })}

exports.upload = upload;
exports.uploader = uploader;

exports.renderMainPage = (req, res) => {    
    res.render('advisingUnitPages/advisingUnitMain',{
        layout: 'advisingUnit'
    })
}

exports.renderStudentRegisterPage = (req, res) => {
    res.render('advisingUnitPages/registerStudents',{
        layout: 'advisingUnit',
    })
}

exports.registerStudents = (req, res) => {    
    /**
     * here student should be added to system
     * 1- the sheet file should be read using some third party library
     * 2- create password for each student 
     * 3- add student to DB , if student could not be created this means it's used, should be deleted or reset has password
     * 4- send the password to student via email <- using third party library
     */
}

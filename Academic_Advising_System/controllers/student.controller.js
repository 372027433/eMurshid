const Students = require('../models/student.model')

const {validationResult} = require ('express-validator/check')


exports.renderMainPage = (req, res) => {
    res.render('studentPages/studentMain',{
        layout: 'student'
    })
};

// Handle get request
exports.renderStudentProfile = async (req, res) => {
     const student = await Students.findById(res.user.userId).select("-password").exec();
    res.render('studentPages/studentProfile', {
        stuId: student.id,
        stuName: student.name,
        major: student.major,
        marital_status: student.marital_status,
        family_members_count: student.family_members_count,
        order_in_family: student.order_in_family,
        permanent_address: student.permanent_address,
        present_address: student.present_address,
        reference_person: student.reference_person,
        reference_person_phone: student.reference_person_phone,
        advisor: student.advisor,
        editMode : false,
        layout: 'student',
    });
};

//Handle post Requests
exports.renderStudentProfileEdit = async (req, res) =>{
    // return all from DB except for password

    const student = await Students.findById(res.user.userId).select("-password").exec();
    let majorsSelection = {'computer science':false , 'information technology':false , 'information system':false }
    if(!req.body){
        return res.sendStatus(400);
    }
    // on Edit button click activate Edit mode and render
    else if(req.body.hasOwnProperty("StuEditBtn")){
        // For keeping User inputs
        for (let element in majorsSelection){
            if (req.body.major === element){
                majorsSelection[element] = true;
                break;
            }
        }

        let maritalSelection = {'single':false, 'married':false}
        for (let element in maritalSelection){
            if (req.body.martialStatus === element){
                maritalSelection[element] = true;
                break;
            }
        }
            res.render('studentPages/studentProfile', {
        email: student.email,
        stuId: student.id,
        stuName: student.name,
        major: student.major,
        marital_status: student.marital_status,

        family_members_count: student.family_members_count,
        order_in_family: student.order_in_family,
        permanent_address: student.permanent_address,
        present_address: student.present_address,
        reference_person: student.reference_person,
        reference_person_phone: student.reference_person_phone,
        advisor: student.advisor,
        CS : majorsSelection["computer science"],
        IT : majorsSelection["information technology"],
        IS : majorsSelection["information system"],
        single : maritalSelection.single,
        married : maritalSelection.married,
        editMode: true,
        layout: 'student',
    });
        // On Update Button Click
            }else if (req.body.hasOwnProperty("stuUpdateBtn")){
        //Validation Errors
        const validationErrors = validationResult(req);
        // DB Update Errors
            let error;
        if(!validationErrors.isEmpty()){
                // for HandleBars CSS logic
            let invalid ={ familyMembersCount:false , orderInFamily:false
                , permanentAddress:false , presentAddress:false , referencePerson:false ,advisor:false }
            for(let element in invalid ){
                    if (validationErrors.array().find(e => e.param === element))
                       invalid[element] =true
                }
                // For keeping User inputs
             majorsSelection = {'computer science':false , 'information technology':false , 'information system':false }
            for (let element in majorsSelection){
                if (req.body.major === element){
                    majorsSelection[element] = true;
                break;
                }
            }

            let maritalSelection = {'single':false, 'married':false}
            for (let element in maritalSelection){
                if (req.body.martialStatus === element){
                    maritalSelection[element] = true;
                    break;
                }
            }
            return res.status(422).render('studentPages/studentProfile', {
                stuId: student.id,
                stuName: student.name,
                major: req.body.major,
                marital_status: req.body.martialStatus,
                family_members_count: req.body.familyMembersCount,
                order_in_family: req.body.orderInFamily,
                permanent_address: req.body.permanentAddress,
                present_address: req.body.presentAddress,
                reference_person: req.body.referencePerson,
                reference_person_phone: req.body.referencePersonPhone,
                advisor: req.body.advisor,
                CS : majorsSelection["computer science"],
                IT : majorsSelection["information technology"],
                IS : majorsSelection["information system"],
                single : maritalSelection.single,
                married : maritalSelection.married,
                invalid : invalid,
                editMode : true,
                valErrors : validationErrors.array()[0].msg,
                layout: 'student',
            });
        }
        //Find by id and update
        await Students.findByIdAndUpdate(res.user.userId,  {
                major: req.body.major,
                marital_status: req.body.martialStatus,
                family_members_count: req.body.familyMembersCount,
                order_in_family: req.body.orderInFamily,
                permanent_address: req.body.permanentAddress,
                present_address: req.body.presentAddress,
                reference_person: req.body.referencePerson,
                reference_person_phone: req.body.referencePersonPhone,
            },{
            // return updated doc
            new : true,
                }
            ,
            function (err, docs) {
                if (err){
                    //save error
                    error = err;
                    console.log(err)
                    // render without changes and return error message
                    res.render('studentPages/studentProfile', {
                        stuId: student.id,
                        stuName: student.name,
                        major: student.major,
                        marital_status: student.marital_status,
                        family_members_count: student.family_members_count,
                        order_in_family: student.order_in_family,
                        permanent_address: student.permanent_address,
                        present_address: student.present_address,
                        reference_person: student.reference_person,
                        reference_person_phone: student.reference_person_phone,
                        advisor: student.advisor,
                        editMode : false,
                        errorMessage : error.message,
                        layout: 'student',
                    });
                }
                else{
                    // success => return new doc with success msg
                    res.render('studentPages/studentProfile', {
                        email: docs.email,
                        stuId: docs.id,
                        stuName: docs.name,
                        major: docs.major,
                        marital_status: docs.marital_status,
                        family_members_count: docs.family_members_count,
                        order_in_family: docs.order_in_family,
                        permanent_address: docs.permanent_address,
                        present_address: docs.present_address,
                        reference_person: docs.reference_person,
                        reference_person_phone: docs.reference_person_phone,
                        advisor: docs.advisor,
                        layout: 'student',
                        successMessage : "Data Updated Successfully",
                        editMode : false,
                    });
                }
            });
        }
}



exports.renderContactAdvisor = (req, res) => {
    res.render('studentPages/contactStudentToAdvisor', {
        layout: 'student'
    });
};

exports.renderMyMessages = (req, res) => {
    res.render('studentPages/studentMessages', {
        layout: 'student'
    });
};

exports.renderBookAppointment = (req, res) => {
    res.render('studentPages/bookAppointment', {
        layout: 'student'
    });
};

exports.renderUpdateMarks = (req, res) => {
    res.render('studentPages/studentUpdateMarks', {
        layout: 'student'
    });
};

exports.renderUpdateAbsence = (req, res) => {
    res.render('studentPages/studentUpdateAbsence', {
        layout: 'student'
    });
};

exports.renderNewComplaint = (req, res) => {
    res.render('studentPages/studentNewComplaint', {
        layout: 'student'
    });
};

//exports.renderComplaintStatus ...


exports.renderNewExcuse = (req, res) => {
    res.render('studentPages/studentExcuses', {
        layout: 'student'
    });
};

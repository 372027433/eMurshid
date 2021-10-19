// Complaint MODEL
const Complaint = require('../models/Complaint.model')

exports.renderMainPage = (req, res) => {    
    res.render('deanPages/deanMain',{
        layout: 'dean'
    })
}

exports.renderResolvedExcuses = (req, res) => {
    res.render('deanPages/deanResolvedExcuses',{
        layout: 'dean'
    })
}

exports.renderComplaints = async (req, res) => {
    const Compl = await Complaint.find({}).populate('compfrom','name id');
    console.log(Compl)
        res.render('deanPages/deanComplaints',{
        complist : Compl ,
        layout: 'dean'
    })
}

exports.renderPendingExcuses = (req, res) => {
    res.render('deanPages/deanPendingExcuses',{
        layout: 'dean'
    })
}

exports.renderRegisteredStudents = (req, res) => {
    res.render('deanPages/deanRegisteredStudents',{
        layout: 'dean'
    })
}
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

exports.renderComplaints = (req, res) => {
    res.render('deanPages/deanComplaints',{
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
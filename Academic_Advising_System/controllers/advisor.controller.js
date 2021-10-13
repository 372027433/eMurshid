exports.renderMainPage = (req, res) => {
    res.render('advisorPages/advisorMain',{
        layout: 'advisor'
    })
}

exports.renderPersonalProfile = (req, res) => {
    res.render('advisorPages/advisorProfile',{
        layout: 'advisor'
    })
}

exports.renderMyStudents = (req, res) => {
    res.render('advisorPages/advisorMyStudents',{
        layout: 'advisor'
    })
}

exports.renderRequestReports = (req, res) => {
    res.render('advisorPages/advisorRequestReports',{
        layout: 'advisor'
    })
}

exports.renderOfficeHours = (req, res) => {
    res.render('advisorPages/advisorOfficeHours',{
        layout: 'advisor'
    })
}

exports.renderAppointments = (req, res) => {
    res.render('advisorPages/advisorAppointments',{
        layout: 'advisor'
    })
}

exports.renderMessageStudents = (req, res) => {
    res.render('advisorPages/advisorMessageStudents',{
        layout: 'advisor'
    })
}

exports.renderFindMessage = (req, res) => {
    res.render('advisorPages/advisorFindMessages',{
        layout: 'advisor'
    })
}

exports.renderIssueComplaint = (req, res) => {
    res.render('advisorPages/advisorIssueComplaint',{
        layout: 'advisor'
    })
}

exports.renderResolveExcuses = (req, res) => {
    res.render('advisorPages/advisorResolveExcuses',{
        layout: 'advisor'
    })
}



exports.messagesend = (req, res) => {
    let thedatenow = new Date();
    let messagerecord = new message({
        msgfrom : res.user.userId ,
        msgto : "61606be7cf646e13ed87a747",
        msgtitel : req.body.Titelmsg,
        msgcontent : req.body.massegContent,
        thetime : `${thedatenow.getHours()}:${thedatenow.getMinutes()}`,
        thedate : `${thedatenow.getDate()}/${thedatenow.getMonth()+1}/${thedatenow.getFullYear()}`
    }); 
    messagerecord.save();

    res.render("studentPages/advisorMessageStudents",{
        layout: 'advisor' 
    })
    
}
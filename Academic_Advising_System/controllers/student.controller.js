exports.renderMainPage = (req, res) => {    
    res.render('studentPages/studentMain',{
        layout: 'student'
    })
}
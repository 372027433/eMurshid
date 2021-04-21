exports.renderMainPage = (req, res) => {
    res.render('advisorPages/advisorMain',{
        layout: 'advisor'
    })
}
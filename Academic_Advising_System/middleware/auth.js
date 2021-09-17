const jwt = require('jsonwebtoken')
/// Authrization middleware
exports.isAuthorized = async (req, res, next) => {
    // get the jwt.verify()
    console.log('isAuthorized get called')
    if(!req.cookies['authorization']) return res.status(401).redirect('/') // in case cookie is not present redirect him to login page

    let authToken = req.cookies['authorization'];
    let token = authToken.split(' ')[1] // take the token content
    try {
        console.log('we are trying something')
        console.log(token)
        let currentUser = await jwt.verify(token, process.env.JWT_ACCESS_KEY)
        console.log(currentUser)
        res.user = currentUser
        next()
    } catch(e){
        console.log('user is not verified')
        res.clearCookie('authorization')
        return res.status(401).redirect('/')
    }
  }

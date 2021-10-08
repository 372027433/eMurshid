/**
 *  importing libraries
**/
const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const hbs = require('express-handlebars')
// use to add either dean or advisingUnitMember
const roles = require('./utils/roles');
const faculty = require('./utils/facultyType')
let {addAdmins} = require('./utils/addAdminsToSystem')

const app = express();

//> nodeJS native libraries
const path = require('path')

//> local files
const router = require('./router')

/**
 * setting up variables
**/
// parse cookies
app.use(cookieParser())

// encode request bodies
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const PORT = process.env.PORT || 5000 ;

//> configuring handlebars
app.set('view engine','hbs')
app.engine('hbs', hbs({
    extname: 'hbs',
    partialsDir: __dirname + "/views/partials",
    layoutsDir: __dirname + "/views/layouts",
}))

/**
 * setting public folder to serve css files, favi icon, js client files
 * 
 * use nginx to serve public files, it's faster then express
**/
app.use(express.static(path.join(__dirname,"public")))

/**
 * setting router file
**/

app.use('/',router);

// should add error handlers in here
app.use(function (err, req, res, next) {
    console.log(process.env.NODE_ENV)
    console.log('This is the invalid field ->', err.field)
    console.log(err.stack)
    next(err)
  })
/**
 * listening port on the browser on development
**/
app.listen( PORT, ()=> {
  console.log(`server is listening on ${PORT}`);
  
  // mongoose connection to Database
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology:true })

  // mongoose connection check
  mongoose.connection.once('open',() => {
    console.log('\tConnection to DB established')

    // addAdmins(roles.advisingUnit, 222222,'Abdullah Salim', faculty.computer_colege)
  })
  mongoose.connection.on('error',() => {
    console.log('\tHey, bad boy we have some serious DB errors, we\'re out')
    process.exit(1);
  })
})
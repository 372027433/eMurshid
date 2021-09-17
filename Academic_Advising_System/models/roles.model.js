
const mongoose = require('mongoose')
const { Schema } = mongoose ;

const rolesSchema = new Schema({
   

})

const Roles = mongoose.model('staff', rolesSchema);

module.exports = Roles ;
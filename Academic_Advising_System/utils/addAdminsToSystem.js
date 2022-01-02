const Staff = require("../models/staff.model");
const roles = require('../utils/roles');

const bcrypt = require("bcrypt");

exports.addAdmins = async (role, id, name, college = "") => {
  // check type of id
  if(role == roles.advisor) return console.log("go and sign the advisor from the advisingUnit page please..!")
  if (typeof id !== "number") {
    return console.log("id should be number");
  }
  // check type of name
  if (typeof name !== "string") {
    return console.log("name should be string");
  }
  // check if user exists
  let userExists = await Staff.findOne({ id: id });

  if (userExists) {
    return console.log("we have this id");
  }
  // default password
  let password = "test1234";

  let salt = bcrypt.genSaltSync(10);
  let hashedPass = bcrypt.hashSync(password, salt);

  let user = {
    password: hashedPass,
    id,
    name,
    email: `${id}@iu.edu.sa`,
    role,
    // faculty_id,
    college,
  };

  let createUser = await Staff.create(user);

  return console.log(createUser);
};

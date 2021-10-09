
// used to spcifiy roles for user
const college = {
    computer_colege: "computer_college",
    engineering_college: "engineering_college",
    science_college: "science_collage"
}
Object.freeze(college) // to prevent updating, deleting, adding new properties to the object in the whole program

/**
 * Object methods to be strict:
 * Object.preventExtension(objName) -> prevent adding - allow deleting, updating
 * Object.seal(objName) -> prevent adding, deleting - allow updating
 * Object.freeze(objName) -> prevent adding, deleting, updating
 */

module.exports = college ; 
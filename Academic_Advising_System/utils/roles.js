
// used to spcifiy roles for user
const roles = {
    advisor: "advisor",
    advisingUnit: "advisingUnit",
    dean: "dean",
    student: "student",
}
Object.freeze(roles) // to prevent updating, deleting, adding new properties to the object in the whole program

/**
 * Object methods to be strict:
 * Object.preventExtension(objName) -> prevent adding - allow deleting, updating
 * Object.seal(objName) -> prevent adding, deleting - allow updating
 * Object.freeze(objName) -> prevent adding, deleting, updating
 */

module.exports = roles ; 
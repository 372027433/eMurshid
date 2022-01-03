// used to spcifiy roles for user
const TIME_SLOTS = {
    fifteen: 15,
}
Object.freeze(TIME_SLOTS) // to prevent updating, deleting, adding new properties to the object in the whole program

/**
 * Object methods to be strict:
 * Object.preventExtension(objName) -> prevent adding - allow deleting, updating
 * Object.seal(objName) -> prevent adding, deleting - allow updating
 * Object.freeze(objName) -> prevent adding, deleting, updating
 */

module.exports = TIME_SLOTS ;
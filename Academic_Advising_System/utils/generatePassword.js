const generator = require("generate-password")

exports.passwordGenerator = () => {
    let generatedPassword = generator.generate({
        length: 10,
        numbers: true,
    });
    return generatedPassword
}

exports.emailAndPasswordTemplateEmail = (email, plainTextPassword) => {
    return `
    <h1>Welcome to Academic Advising In Islamic University</h1>
    <div> <h2>you have been registered at Academic Advising Unit</h2></div>
    <div><h4>email: <b>${email}</b></h4></div>
    <div><h4>Password: <b>${plainTextPassword}</b></h4></div>

    <p> Ignore this message if you don't know what it mean </p>
`
}
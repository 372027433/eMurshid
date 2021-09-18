console.log("this is login page script");

let pass = document.getElementById("password");
let uniId = document.getElementById("universityID");

// uniId.addEventListener('keypress',(event) => {return /[a,b,j,d,r,s,x,t,e,g,k,l,z,n,h,u,v]/i.test(event.key)})
// uniId.onkeyup = (event) => {
//   console.log(event.key);
//   return /[0-9]/i.test(event.key);
// };

// document.body.addEventListener("submit", (e) => {
//   e.preventDefault();
//   if (e.target.id === "register") {
//     const userPassword = pass.value;
//     const id = uniId.value;

//     const credentials = {
//       id,
//       password: userPassword,
//     };

//     console.log("credentials:",credentials);

//     fetch("/login", {
//       method: "POST",
//       body: JSON.stringify(credentials),
//       headers: {
//         "Accept": "application/json",
//         "Content-Type": "application/json",
//       },
//     })
//     // .then(res => {
//     //     console.log(res.headers)
//     //     return res.json()})
//     .then((res) => {
//         console.log(res)
//         // console.log(res.headers)
//         // console.log(res.redirected)
//         if (res.redirected) {
//             window.location.href = res.url;
//         }
//     })
//     // .then(res => res.text())
//     // .then(htmlStr => {
//     //     document.open();
//     //     // document.write('');
//     //     document.write(htmlStr);
//     //     document.close(); 
//     // })
//   }
// });

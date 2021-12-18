"use strict";

let toggleBtn = document.querySelector(".toggle-btn");
let navBody = document.querySelector(".nav-body");
let mainContent = document.querySelector(".main-content");
// let closeNav = document.querySelector(".close-nav");
let navigation = document.querySelector(".navigation");

// closeNav.addEventListener("click", () => {

//     navigation.classList.add('close-navigation')
//     navBody.classList.add('dn'); // to remove text inside the element
//     toggleBtn.classList.remove('dn');
// });

// toggleBtn.addEventListener("click", () => {
    
//     navigation.classList.remove('close-navigation')
//     navBody.classList.remove('dn')  
//     toggleBtn.classList.add('dn');
   
// });

window.addEventListener('resize',(e)=> {
 
    if(e.currentTarget.outerWidth <= 450){
        // make changes when screen is small here..!
        
    } 
})

// let scrollHeight = Math.max(
//     document.body.scrollHeight,document.body.offsetHeight,document.body.clientHeight,
//     document.documentElement.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight, 
//     )
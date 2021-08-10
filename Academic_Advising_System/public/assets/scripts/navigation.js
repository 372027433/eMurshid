"use strict";

let toggleBtn = document.querySelector(".toggle-btn");
let navBody = document.querySelector(".nav-body");
let mainContent = document.querySelector(".main-content");
let closeNav = document.querySelector(".close-nav");
let navigation = document.querySelector(".navigation");

closeNav.addEventListener("click", () => {

    // navigation.style.width = '0vw'; 
    navigation.classList.add('close-navigation')

    navBody.style.display = 'none'; // to remove text inside the element
    toggleBtn.style.display = "initial";
});

toggleBtn.addEventListener("click", () => {
    navigation.classList.remove('close-navigation')

    // navigation.style.width = '20vw'; 
    // navigation.classList.add
    navBody.style.display = 'block';
    toggleBtn.style.display = "none";
   
});

let scrollHeight = Math.max(
    document.body.scrollHeight,document.body.offsetHeight,document.body.clientHeight,
    document.documentElement.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight, 
    )
window.addEventListener('resize',(e)=> {
    if(e.currentTarget.outerWidth <= 450){
        console.log('make changes now')
    }
})

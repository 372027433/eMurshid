

const translationBtn = document.getElementById('translateBtn')

let lang = localStorage.getItem('lang');
console.log(lang)

const translateLanguage = () => {
    if(lang == 'ar'){
        // Website is on English version
        lang = 'en'
        localStorage.setItem('lang',lang)
        translationBtn.innerText = 'عربي'
        console.log('executed... English')
        document.getElementsByTagName('html')[0].setAttribute('lang',lang)
        document.getElementsByTagName('html')[0].setAttribute('dir','ltr')
        // translateAll(lang)
    } else {
        // Website is on Arabic version
        lang = 'ar'
        translationBtn.innerText = 'en'
        localStorage.setItem('lang',lang)
        console.log('executed... arabic')
        document.getElementsByTagName('html')[0].setAttribute('lang',lang)
        document.getElementsByTagName('html')[0].setAttribute('dir','rtl')
        // translateAll(lang)
    }
    // now run translation
    
    
}

// function translateAll (language) {
//     translateNavigation(language)
//     translateMainContent(language)
// }

// function translateNavigation (language) {   
//     console.log('lang is:',language) 
//     $('.navigation').translate({lang: language, t: navTrans})
// }

// function translateMainContent (language) {
//     console.log('lang is:',language) 
//     $('.main-content').translate({lang: language, t: mainContentTrans})
// }


// translateLanguage();
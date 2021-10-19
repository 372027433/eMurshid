
// page loads everytime
// what I want is based on the language the direction of the page will be used

// the function should be called each time without changing the value of the lang var
const translationBtn = document.getElementById('translateBtn')

let lang = localStorage.getItem('lang');

function toggleLang(){
    lang == 'ar' ? localStorage.setItem('lang','en') : localStorage.setItem('lang','ar');
    translateLanguage();
    window.location.reload();
}

const translateLanguage = () => {
    console.log(lang === 'ar')
    if(lang == 'en'){
        // Website is on English version

        translationBtn.innerText = 'عربي'
        document.getElementsByTagName('html')[0].setAttribute('lang',"en")
        document.getElementsByTagName('html')[0].setAttribute('dir','ltr')
        translateAll(lang)

    } 
    else {
        // Website is on Arabic version

        translationBtn.innerText = 'en'
        document.getElementsByTagName('html')[0].setAttribute('lang',"ar")
        document.getElementsByTagName('html')[0].setAttribute('dir','rtl')
        translateAll(lang)
    }
    // now run translation
}

function translateAll (language) {
    translateNavigation(language)
    translateMainContent(language)
}

function translateNavigation (language) {   
    console.log('lang is:',language) 
    $('.navigation').translate({lang: language, t: navTrans})
}

function translateMainContent (language) {
    console.log('lang is:',language) 
    $('.main-content').translate({lang: language, t: mainContentTrans})
}

translateLanguage();

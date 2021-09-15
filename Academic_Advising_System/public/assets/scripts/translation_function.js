

const translationBtn = document.getElementById('translateBtn')

let lang = localStorage.getItem('lang');

const translateLanguage = () => {
    if(lang == 'ar'){
        // Website is on English version
        lang = 'en'
        translationBtn.innerText = 'عربي'
        document.getElementsByTagName('html')[0].setAttribute('lang',lang)
        document.getElementsByTagName('html')[0].setAttribute('dir','ltr')
    } else {
        // Website is on Arabic version
        lang = 'ar'
        translationBtn.innerText = 'en'
        document.getElementsByTagName('html')[0].setAttribute('lang',lang)
        document.getElementsByTagName('html')[0].setAttribute('dir','rtl')
    }
    // now run translation
    translateNavigation()
    translateMainContent()
    
}

const translateNavigation = () => {    
    $('.navigation').translate({lang: lang, t: navTrans})
}

const translateMainContent = () => {
    console.log(mainContentTrans);
    $('.main-content').translate({lang: lang, t: mainContentTrans})
}


translateLanguage();
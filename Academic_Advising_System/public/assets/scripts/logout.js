/// Browser logout function
function logout(){
    console.log('we need to implement logout functioniality..')
    fetch('/logout')
    .then((res) => {
        if (res.redirected) {
            window.location.href = res.url;
        } else {
            window.location.href = '/';
        }

    })
}
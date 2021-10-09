function validateAdvisorId(event){
    // let inputVal = event.target ;
    // console.log(event.target.value)
    // inputVal.value 
    // if()
    // return (event.target.value.length < 6)? /^[0-9]{1,8}$/.test(event.key) : event.target.value.slice(0,7)
    let prevVal = event.target.value ;
    if(/^[0-9]{0,8}$/.test(event.key)){
        // we have numbers
        // if(event.target.value.length < 7){
        //     // here length is less than 7 digits
        // } else {
    
        // }
        event.target.value = event.target.value ;
    } else {
        // return the text without last digit entered
        event.target.value = event.target.value.slice(0,event.target.value.length -1)
        return 
    }
}
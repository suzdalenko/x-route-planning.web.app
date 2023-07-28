let emailUserId = document.getElementById('emailUserId')
if(emailUserId){
    emailUserId.innerText = window.localStorage.getItem('email')
}


console.log(window.localStorage)


if(!window.localStorage.getItem("email") || !window.localStorage.getItem("uid")){
    window.location.href = "/"
}
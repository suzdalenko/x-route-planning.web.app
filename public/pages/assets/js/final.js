let emailUserId = document.getElementById('emailUserId')
if(emailUserId){
    emailUserId.innerText = window.localStorage.getItem('email')
}


console.log(window.localStorage)


if(!window.localStorage.getItem("email") || !window.localStorage.getItem("uid")){
    window.location.href = "/"
}


let idLinkEmailUserId = document.getElementById("idLinkEmailUserId")
if(idLinkEmailUserId){
    let userIdLink = window.localStorage.getItem('user_id')
    if(window.location.href.includes("ordersonmap")){
        idLinkEmailUserId.href = '/pages/dashboard.html#user='+userIdLink
    } else if(window.location.href.includes('routeview')){
        let collection_id = window.localStorage.getItem("collection_id")
        idLinkEmailUserId.href = '/pages/ordersonmap.html#user='+userIdLink+'&collection='+collection_id
    }
}


let aReloadId = document.getElementById("aReloadId")
if(aReloadId){
    aReloadId.addEventListener("click", function(event){
        event.preventDefault()
        window.location.reload()
    })   
}
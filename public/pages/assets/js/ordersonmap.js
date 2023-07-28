let USER_ID       = window.localStorage.getItem("user_id")
let COLLECTION_ID = window.localStorage.getItem("collection_id") 
let MYSITE_URL    = window.localStorage.getItem("PYTHON_URL")



function getLinesCollection(){
    let divListOrders  = document.getElementById("divListOrders")
    let htmlListOrders = ''
    fetch(MYSITE_URL+'lines_collection/colection_user/?user_id='+USER_ID+'&colection_id='+COLLECTION_ID).then(res => res.json()).then(djangoResponse => {
        djangoResponse.forEach(itemObj => {
            infoObj = itemObj.fields
            console.log(infoObj)
            htmlListOrders += `<div>`+infoObj.order_id+` `+infoObj.client_name+`</div>`
        })
        divListOrders.innerHTML = htmlListOrders

       
    }).catch(e => console.log(e))
}

getLinesCollection()
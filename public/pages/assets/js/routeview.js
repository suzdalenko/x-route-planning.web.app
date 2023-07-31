let USER_ID                = window.localStorage.getItem("user_id")
let COLLECTION_ID          = window.localStorage.getItem("collection_id") 
let MYSITE_URL             = window.localStorage.getItem("PYTHON_URL")
let UID                    = window.localStorage.getItem("uid")
let TRACK_ID               = window.localStorage.getItem("track_page_open")


function getRouteTrack(){
    fetch(MYSITE_URL+'lines_collection/orders_by_route/?collection_id='+COLLECTION_ID+"&truck_id="+TRACK_ID).then(res => res.json()).then(res => {
        console.log(res)
    })
}

getRouteTrack()













































if(!window.localStorage.getItem("uid") || !window.localStorage.getItem("user_id")){
    window.location.href = "/"
}
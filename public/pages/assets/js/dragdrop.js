let FIRST_ID       = null
let FIRST_BYORDER  = null
let SECOND_ID      = null
let SECOND_BYORDER = null

function dragFunction(event, id, order_id) {
    FIRST_ID      = id
    FIRST_BYORDER = order_id
}

function dropFunction(x, y, z){
    x.preventDefault();
    SECOND_ID      = y
    SECOND_BYORDER = z          ; console.log('firstId='+FIRST_ID, 'secondId='+SECOND_ID); console.log('first='+FIRST_BYORDER, 'second='+SECOND_BYORDER,)
    if(FIRST_ID == SECOND_ID || FIRST_BYORDER == SECOND_BYORDER) return
    LoaderRoutePlanner('block')
    let formData = new FormData()
        formData.append("first_id", FIRST_ID)
        formData.append("first_or", FIRST_BYORDER)
        formData.append("second_id", SECOND_ID)
        formData.append("second_or", SECOND_BYORDER)
        formData.append("collection_id", COLLECTION_ID)
        formData.append("truck_id", TRACK_ID)
        formData.append("uid", UID)
        formData.append("user_id", USER_ID)
    fetch(MYSITE_URL+'post_parameters/change_by_order/', {method: "POST", body: formData}).then(res => res.json()).then(res => {
        initMap()
        LoaderRoutePlanner('none')
    }).catch(e => {
        initMap()
        LoaderRoutePlanner('none')
    })
}




function allowDropFunction(ev) { ev.preventDefault(); }
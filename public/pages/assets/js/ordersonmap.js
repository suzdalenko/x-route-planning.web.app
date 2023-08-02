let USER_ID                = window.localStorage.getItem("user_id")
let COLLECTION_ID          = window.localStorage.getItem("collection_id") 
let MYSITE_URL             = window.localStorage.getItem("PYTHON_URL")
let UID                    = window.localStorage.getItem("uid")

var ORDERS_LIST            = []
var GOOGLE_MAP             = null
var LISTADO_MARKERS        = []

var drawingManager         = null
var listadoIdSeleccionados = []

function getLinesCollection() {
    let divListOrders   = document.getElementById("divListOrders")
    let listTrackId     = document.getElementById("listTrackId")
    let htmlListOrders  = ''
    ORDERS_LIST         = []
    let trask_unique_id = []

    fetch(MYSITE_URL+'lines_collection/colection_user/?collection_id='+COLLECTION_ID).then(res => res.json()).then(djangoResponse => {
        divListOrders.innerHTML = ''
        listTrackId.innerHTML   = ''
        djangoResponse.forEach(itemObj => {                    
            let paintInRed = ''
            infoObj = itemObj.fields                           
            ORDERS_LIST.push(infoObj)
            /* listado pedidos sin camion */

            if(!infoObj.truck){
                if(!infoObj.lat || !infoObj.lng){
                    paintInRed = 'style = "color:red;"'
                }
                htmlListOrders +=   `<div title="Cuidad `+infoObj.city+`, Paletas ` +infoObj.palets+`, Kilos `+infoObj.kilos+`" `+paintInRed+`>`
                                        +infoObj.order_id+` `+infoObj.client_name+
                                    `</div>`
            }
            if(infoObj.truck && !trask_unique_id.includes(infoObj.truck)){
                trask_unique_id.push(infoObj.truck) 
            }
        })
        divListOrders.innerHTML = htmlListOrders
        addMarkersInMap()
        /* listado camiones */
        trask_unique_id.sort((a, b) => {return a - b;})
        let htmlContentTrusk = ''
        let colorDelCamion   = ''

        trask_unique_id.forEach(truckNumber => {
            let truckNameRes   = 'Camion'
            let numberPalets   = 0
            let numberKg       = 0
            let htmlOrdersCont = ''
            
            ORDERS_LIST.forEach(currentOrder => {
                if(truckNumber == currentOrder.truck){
                    if(currentOrder.truck_name){ truckNameRes = currentOrder.truck_name }
                    numberPalets   += currentOrder.palets
                    numberKg       += currentOrder.kilos
                    htmlOrdersCont += currentOrder.client_name+` (`+currentOrder.palets+`, `+currentOrder.kilos+`)<br>`
                }
                console.log(currentOrder)
            })
            switch (truckNumber) {
                case   1: colorDelCamion = 'style="background-color:#FF00DC;color:white;"'; break
                case   2: colorDelCamion = 'style="background-color:#7F0000;color:white;"'; break
                case   3: colorDelCamion = 'style="background-color:#FFD800;color:black;"'; break
                case   4: colorDelCamion = 'style="background-color:#FF6A00;color:white;"'; break
                case   5: colorDelCamion = 'style="background-color:#B300FF;color:white;"'; break
                case   6: colorDelCamion = 'style="background-color:#00FFFF;color:black;"'; break
                case   7: colorDelCamion = 'style="background-color:#00FF90;color:black;"'; break
                case   8: colorDelCamion = 'style="background-color:#267F00;color:white;"'; break
                case   9: colorDelCamion = 'style="background-color:#007FFF;color:white;"'; break
                case  10: colorDelCamion = 'style="background-color:#FF0000;color:white;"'; break
                case  11: colorDelCamion = 'style="background-color:#90a8ea;color:white;"'; break
                default : colorDelCamion = 'style="background-color:#90a8ea;color:white;"'; break
            }
            htmlContentTrusk += `<div class="blockTruck" `+colorDelCamion+`>
                                    <div onclick="ShowHideListOrders(`+truckNumber+`, event)">`+truckNumber+`. `+truckNameRes+` <br> Pal `+numberPalets+`, Kg `+numberKg+`
                                        <i class="fa fa-arrow-right positonRigth" onclick="openRoutePage(`+truckNumber+`, event)"></i> 
                                    </div>    
                                    <div class="smallDescrip" id="listOrdersInTrack`+truckNumber+`" `+getInfoDisplaing(truckNumber)+`>`+htmlOrdersCont+`</div>
                                </div>`
        })

        listTrackId.innerHTML = htmlContentTrusk
        
    }).catch(e => console.log(e))
}

function addMarkersInMap() {
    LISTADO_MARKERS.forEach(currentMarker => { currentMarker.setMap(null); currentMarker = null; })
    LISTADO_MARKERS = []
    ORDERS_LIST.forEach(_orden_ => {
        if(_orden_.lng && _orden_.lat){
            let  myLatlng = new google.maps.LatLng(_orden_.lat, _orden_.lng)
            let descrpcionMarker = `Pedido id `+_orden_.order_id+` \n Cliente `+_orden_.client_name+` \n Cuidad `+_orden_.city+` \n Paletas `+_orden_.palets+` \n Kilos `+_orden_.kilos
            if(_orden_.truck > 0) { descrpcionMarker += ' \n (CAMION '+_orden_.truck+')'; }
            let markerData = {position: myLatlng, title: descrpcionMarker, line_id: _orden_.line_id }
            if(_orden_.truck > 0)  { markerData.icon = '/pages/assets/img/'+_orden_.truck+'.png' }
            if(_orden_.truck > 11) { markerData.icon = '/pages/assets/img/11.png'; }
            let marker = new google.maps.Marker(markerData)
            LISTADO_MARKERS.push(marker)
            marker.setMap(GOOGLE_MAP)
        }
    })
}

function createNewTrack (listadoIdLineasSeleccionadas){
    if(listadoIdLineasSeleccionadas.length > 0){
        setTimeout(() => {
            LoaderSuzdalenko('block')        
            let trackIdNameEmpty = prompt('¿Crear camión nuevo o añadir pedidos a ya existente? \n NOMBRE DE CAMIÓN - se crea un nuevo camión con nombre \n NUMERO DE CAMIÓN - se añade pedidos a un camión existente \n VACIO - se crea un nuevo camión sin nombre', '')
            let stringArray      = ''
                listadoIdLineasSeleccionadas.forEach(item => { stringArray += item+','; })
            let typeTrack        = ''

            if(trackIdNameEmpty == ''){
                typeTrack = "empty"
            } else {
                let nameLoweeSplit = trackIdNameEmpty.toLowerCase().split('')
                let alphabet       = 'qwertyuioplkjhgfdsazxcvbnm'
                for(let i = 0; i < nameLoweeSplit.length; i++ ) {
                    if(alphabet.includes(nameLoweeSplit[i])){
                        typeTrack = "string"
                        break
                    }
                        typeTrack = "number"
                    }
            }

            let formData = new FormData()
                formData.append('user_id', USER_ID)
                formData.append('uid', UID)
                formData.append('collection_id', COLLECTION_ID)
                formData.append('list_lines_id', stringArray)
                formData.append('track_data', trackIdNameEmpty)
                formData.append('type_track', typeTrack)                   

            fetch(MYSITE_URL+'post_parameters/create_new_track/', {method:'POST', body: formData}).then(res => res.json()).then(result => {
                initMap()
                LoaderSuzdalenko('none')
            }).catch( e => LoaderSuzdalenko('none'))
        }, 111)
    }
}


function initMap() {  
    drawingManager         = null
    listadoIdSeleccionados = []
    GOOGLE_MAP             = new google.maps.Map(document.getElementById('googleMap'), {center: {lat: 40.4167754 , lng: -3.7037902}, zoom: 7})
      
    drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {position: google.maps.ControlPosition.TOP_CENTER, drawingModes: [google.maps.drawing.OverlayType.POLYGON]},
            circleOptions: {fillColor: '#000000', fillOpacity: 1, strokeWeight: 7, clickable: false, editable: false, zIndex: 1}
    })
    drawingManager.setMap(GOOGLE_MAP)
   
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
        let listadoIdLineasSeleccionadas = []
        LISTADO_MARKERS.forEach(markerA => {
            if(google.maps.geometry.poly.containsLocation(markerA.getPosition(), polygon) == true) {
                listadoIdLineasSeleccionadas.push(markerA.line_id)
            }
        }) 
        listadoIdSeleccionados = listadoIdSeleccionados.concat(listadoIdLineasSeleccionadas)
        // pintarEnVerdeItemsSeleccionados(listadoIdSeleccionados)
        createNewTrack(listadoIdLineasSeleccionadas) 
    })

    getLinesCollection()
}

document.getElementById("releaseOrdersId").addEventListener("click", () => {
    let promptReleaseOrders = confirm("¿Liberar pedidos?")
    if(promptReleaseOrders){
        let formData = new FormData()
            formData.append('user_id', USER_ID)
            formData.append('uid', UID)
            formData.append('collection_id', COLLECTION_ID)
        fetch(MYSITE_URL+'post_parameters/release_orders/', {method: "POST", body: formData}).then(res => res.json()).then(res => {
            initMap()
        }).catch(e => { initMap(); })
    }
})

function ShowHideListOrders(truckNumber, event){
    event.stopPropagation()
    let nameId = "listOrdersInTrack"+truckNumber
    let listOrdersInTrack = document.getElementById("listOrdersInTrack"+truckNumber) 
    if(listOrdersInTrack){
        if(listOrdersInTrack.style.display != "none"){
            listOrdersInTrack.style.display = "none"
        } else if (listOrdersInTrack.style.display != "block"){
            listOrdersInTrack.style.display = "block"
        } 
        window.localStorage.setItem(nameId, listOrdersInTrack.style.display)
    }
    console.log(window.localStorage)
}

function getInfoDisplaing(trackId){
    let nameId    = "listOrdersInTrack"+trackId
    let situation =  window.localStorage.getItem(nameId) || 'block'
    return `style="display:`+situation+`"`
}

function openRoutePage(truckNumber, event){
    event.stopPropagation()
    window.localStorage.setItem("track_page_open", truckNumber)
    window.location.href = '/pages/routeview.html#user='+USER_ID+'collection='+COLLECTION_ID+'&track='+truckNumber
}


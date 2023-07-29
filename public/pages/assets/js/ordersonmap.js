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
    let divListOrders  = document.getElementById("divListOrders")
    let htmlListOrders = ''
    ORDERS_LIST        = []

    fetch(MYSITE_URL+'lines_collection/colection_user/?user_id='+USER_ID+'&colection_id='+COLLECTION_ID).then(res => res.json()).then(djangoResponse => {
        djangoResponse.forEach(itemObj => { 
            infoObj = itemObj.fields
            ORDERS_LIST.push(infoObj)
            htmlListOrders +=   `<div title="Cuidad `+infoObj.city+`, Paletas ` +infoObj.palets+`, Kilos `+infoObj.kilos+`">`
                                    +infoObj.order_id+` `+infoObj.client_name+
                                `</div>`
        })
        divListOrders.innerHTML = htmlListOrders
        addMarkersInMap()
    }).catch(e => console.log(e))
}

function addMarkersInMap() {
    LISTADO_MARKERS.forEach(currentMarker => { currentMarker.setMap(null); currentMarker = null; })
    LISTADO_MARKERS = []
    ORDERS_LIST.forEach(_orden_ => {
        if(_orden_.lng && _orden_.lat){
            let  myLatlng = new google.maps.LatLng(_orden_.lat, _orden_.lng)
            let descrpcionMarker = `Pedido id `+_orden_.order_id+` \n Cliente `+_orden_.client_name+` \n Cuidad `+_orden_.city+` \n Paletas `+_orden_.palets+` \n Kilos `+_orden_.kilos
            // if(item.__camion > 0){
            //     descrpcionMarker += ' CAMION('+item.__camion+')'
            // }
            let markerData = {position: myLatlng, title: descrpcionMarker, line_id: _orden_.line_id }
            // if(item.__camion > 0)  { markerData.icon = '/portal/themes/llood/assets/markers/'+item.__camion+'.png';  }
            // if(item.__camion > 11) { markerData.icon = '/portal/themes/llood/assets/markers/11.png'; }
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
                listadoIdLineasSeleccionadas.forEach(item => { stringArray += item+','; }); console.log(stringArray, listadoIdLineasSeleccionadas)
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
        }, 1111)
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




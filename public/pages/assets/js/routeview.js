let USER_ID                 = window.localStorage.getItem("user_id")
let COLLECTION_ID           = window.localStorage.getItem("collection_id") 
let MYSITE_URL              = window.localStorage.getItem("PYTHON_URL")
let UID                     = window.localStorage.getItem("uid")
let TRACK_ID                = window.localStorage.getItem("track_page_open")
var listadoEntregas         = []
var lstadoLocations         = null
var waypoints               = []
var map, directionsService, directionsRenderer
var listadoMarkers          = []
var listdoRealMarkers       = []
var kg_route                = 0
var pl_route                = 0
var leenda_orders           = ''
var routeName               = ''

function getRouteTrack(){
    listadoEntregas   = []
    lstadoLocations   = []
    waypoints         = []
    listadoMarkers    = []
    kg_route          = 0
    pl_route          = 0
    leenda_orders     = ""

    fetch(MYSITE_URL+'lines_collection/orders_by_route/?collection_id='+COLLECTION_ID+"&truck_id="+TRACK_ID).then(res => res.json()).then(res => { 
        let firstElement = res.result[0]
        lstadoLocations.push(new google.maps.LatLng(firstElement.plat, firstElement.plng))
        // spanRoute
        routeName = firstElement.truck+'. '
        firstElement.truck_name ? routeName += firstElement.truck_name : routeName += ' Camion'
        document.getElementById("spanRoute").innerHTML = routeName

        listdoRealMarkers.forEach(currentMarker => { currentMarker.setMap(null); currentMarker = null; })
        listdoRealMarkers = []
        let countOrder = 0
       
        res.result.forEach(item => {                                              
            listadoEntregas.push(item)
            lstadoLocations.push(new google.maps.LatLng(item.clat, item.clng))
            let ubicacion = {
                location: new google.maps.LatLng(item.clat, item.clng),
                label: ' '+ ++countOrder +' ',
                title: 'Pedido '+item.order_id+' \n '+item.client_name+' \n Paletas'+item.palets+' \n Kilos '+item.kilos+' \n '+item.city,
            }
            listadoMarkers.push(ubicacion)
            waypoints.push({location: new google.maps.LatLng(item.clat, item.clng)})
            kg_route += item.kilos
            pl_route += item.palets
            leenda_orders += `<div class="itemPedido" draggable="true" ondragstart="dragFunction(event,`+item.id+`,`+item.by_order+`)" ondrop="dropFunction(event,`+item.id+`,`+item.by_order+`)" ondragover="allowDropFunction(event)">
                                `+countOrder+`. Pedido-`+item.order_id+`, `+item.client_name+`<br>
                                Paletas `+item.palets+`, Kilos `+item.kilos+`<br>
                              </div>`
            
        })

        displayRoute(lstadoLocations, waypoints, directionsService, directionsRenderer)
        mostrarListadoPedidos(listadoEntregas)
          // if(res.result[0].__nombre__camion){
          //   document.getElementById('nombreCamion').innerHTML = res.result[0].__camion+'. '+res.result[0].__nombre__camion
          // }
        document.getElementById("listOrders").innerHTML = leenda_orders
    })
}

function initMap() {
    map = new google.maps.Map(document.getElementById("googleMap"), {zoom: 9, center: { lat: 40.4379543, lng: -3.6795367}})
    directionsService  = new google.maps.DirectionsService()
    directionsRenderer = new google.maps.DirectionsRenderer({map, suppressMarkers: true})
    getRouteTrack()
}

function displayRoute(lstadoLocations, waypoints, service, display) {
     
    listadoMarkers.forEach(item => {                  
        let Marker = new google.maps.Marker({
          position: item.location,          
          label: item.label,
          title: item.title, 
          map: map,
          // icon : 'https://p.kindpng.com/picc/s/174-1747809_transparent-location-white-icon-png-png-download.png'
        })     
    
        listdoRealMarkers.push(Marker)
    })
  
    service.route({                           
        origin:      lstadoLocations[0], 
        destination: lstadoLocations[lstadoLocations.length -1],
        waypoints:   waypoints,
        travelMode:  google.maps.TravelMode.DRIVING,
        avoidTolls:  true,
      }).then((result) => {
        display.setDirections(result)
        computeTotalDistance(result)
      }).catch((e) => {
        alert("Could not display directions due to: " + e);
      })
}

function mostrarListadoPedidos(x){
   
}

function computeTotalDistance(result) {
    let total = 0;
    const myroute = result.routes[0];
    if (!myroute) { return; }
    for (let i = 0; i < myroute.legs.length; i++) { total += myroute.legs[i].distance.value; }
    total = parseInt(total / 1000)
    document.getElementById("totalA").innerHTML = 'Distancia '+total+' km'
    document.getElementById("kgA").innerHTML = 'Kilos '+kg_route+' kg'
    document.title = routeName+' '+total+' km'
    document.getElementById("palA").innerHTML = 'Paletas '+pl_route
}

document.getElementById("recalcRoute").addEventListener("click", () => {
  let recalcularRuta = confirm('¿Recalcular Ruta?')
  if(recalcularRuta){
    LoaderRoutePlanner('block')
    let formData = new FormData()
        formData.append("user_id", USER_ID)
        formData.append("uid", UID)
        formData.append("collection_id", COLLECTION_ID)
        formData.append("truck_id", TRACK_ID)
    fetch(MYSITE_URL+'post_parameters/recalculate_route/', {method: "POST", body: formData}).then(res => res.json()).then(res => {
      initMap()
      LoaderRoutePlanner('none')
    }).catch(e => {
      initMap()
      LoaderRoutePlanner('none')
    })  
  }
})







































if(!window.localStorage.getItem("uid") || !window.localStorage.getItem("user_id")){
    window.location.href = "/"
}
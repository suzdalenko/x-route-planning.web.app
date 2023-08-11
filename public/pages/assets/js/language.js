var miLang = null

var langRepository = {
    en:{
        truckName: "Truck name",
        releseTruck: "¿Liberar camion numero ",
        releaseOrder: "¿Release order or change truck?",
    },
    es:{
        truckName: "Nombre de camion",
        releseTruck: "¿Release truck number ",
        releaseOrder: "¿Release order or change truck?",
    }
}

let currentLang = window.localStorage.getItem("lang") || "es"
if(currentLang == "es"){
    miLang = langRepository.es
} else {
    miLang = langRepository.en
}

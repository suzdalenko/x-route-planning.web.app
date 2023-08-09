var miLang = null

var langRepository = {
    en:{
        truckName: "Truck name",
    },
    es:{
        truckName: "Nombre de camion",
    }
}

let currentLang = window.localStorage.getItem("lang") || "es"
if(currentLang == "es"){
    miLang = langRepository.es
} else {
    miLang = langRepository.en
}

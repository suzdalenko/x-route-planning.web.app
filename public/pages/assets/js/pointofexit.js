let inputArray = ['inputCountry', 'inputRegion', 'inputCity']
    inputArray.forEach(currentInput => {
        let inputA = document.getElementById(currentInput)
        if(inputA){
            inputA.addEventListener('keyup', (event) => {
                saveLocationData(event)
            })
        }
    })

function saveLocationData(event){
    let keyCode = event.code || event.key
    if(keyCode.toLowerCase() == 'enter'){
        LoaderSuzdalenko('block')
        let formData = new FormData()
            formData.append("country", inputCountry.value)
            formData.append("region", inputRegion.value)
            formData.append("city", inputCity.value)
            formData.append("user_id", window.localStorage.getItem("user_id"))
            formData.append("uid", window.localStorage.getItem("uid"))
            formData.append("email", window.localStorage.getItem("email"))

        fetch(PYTHON_URL+'save_user_location/', {method: "POST", body: formData}).then( res => res.json()).then( djangoLocation => {
            window.localStorage.setItem('country', djangoLocation.country || '')
            window.localStorage.setItem('region', djangoLocation.region || '')
            window.localStorage.setItem('city', djangoLocation.city || '')
            pushLocatonToWebPage()
            LoaderSuzdalenko('none')
        }).catch(e => { LoaderSuzdalenko('none'); })
    }
}

function pushLocatonToWebPage(){   
    inputCountry.value = window.localStorage.getItem("country") || "España" 
    inputRegion.value  = window.localStorage.getItem("region") || "Cantabria"
    inputCity.value    = window.localStorage.getItem("city") || "Santander"
    
    console.log("==>", window.localStorage.getItem("country"))
}  

pushLocatonToWebPage()
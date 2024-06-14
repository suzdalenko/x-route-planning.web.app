const config = {
    apiKey: "AIzaSyDZ6cpfLEHB6YTN_C1UXw5dpaOuO3041s8",
    authDomain: "x-route-planning.firebaseapp.com",
    databaseURL: "https://x-route-planning-default-rtdb.firebaseio.com",
    projectId: "x-route-planning",
    storageBucket: "x-route-planning.appspot.com",
    messagingSenderId: "536796594344",
    appId: "1:536796594344:web:bfff3ae5a787d1a457029d",
    measurementId: "G-VHTNMZ1N44"
}

const firebaseConfigDontUse = {
    apiKey: "AIzaSyDZ6cpfLEHB6YTN_C1UXw5dpaOuO3041s8",
    authDomain: "x-route-planning.firebaseapp.com",
    databaseURL: "https://x-route-planning-default-rtdb.firebaseio.com",
    projectId: "x-route-planning",
    storageBucket: "x-route-planning.appspot.com",
    messagingSenderId: "536796594344",
    appId: "1:536796594344:web:bfff3ae5a787d1a457029d",
    measurementId: "G-VHTNMZ1N44"
  };
  

let PYTHON_URL = 'https://suzdalenkoalexey.pythonanywhere.com/myapp/'
    window.localStorage.setItem('PYTHON_URL', PYTHON_URL)

if( window.location.href.includes('http://127.0.0.1')){
    PYTHON_URL = 'http://127.0.0.1:8000/myapp/'
    window.localStorage.setItem('PYTHON_URL', PYTHON_URL)
} 


async function PythonLogin(uid, email, password){
    return fetch(PYTHON_URL+'userLogin/?uid='+uid+"&email="+email+"&password="+password).then(res => res.json()).then(django => { console.log("juijjui", django)
        if(django.user_id > 0){
            document.title = 'Listado rutas '+django.email
            window.localStorage.setItem('user_id', django.user_id)
            window.localStorage.setItem('country', django.country)
            window.localStorage.setItem('region', django.region)
            window.localStorage.setItem('city', django.city)
            return {res:"ok", user_id: django.user_id}
        } else {
            console.log('config.js Backend django error');
            alert('Error 0');
        }
    }).catch( e => {
        console.log('Error 1 '+e);
    })
}


function LoaderRoutePlanner(state){
    let loaderDiv = document.getElementById('loaderDiv')
    if(loaderDiv){
        loaderDiv.style.display = state
    }
}

function getWeekNumber(dateString) {
    dateString = dateString.split('-')
    let currentDate = new Date(dateString[0], dateString[1]-1, dateString[2]);
    let startDate = new Date(currentDate.getFullYear(), 0, 1);  
    var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7)
}

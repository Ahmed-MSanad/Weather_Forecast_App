const forecastContainer = document.querySelector('.forecast-container');
const forecastInput = document.querySelector('.input-group input');
const forecastBtn = document.querySelector('.input-group button');
const spinner = document.querySelector('.spinner');
let numberOfDays = 3;


// for sure
// console.log(forecastInput);
// console.log(forecastBtn);


forecastInput.addEventListener('input',function(eventInfo){
    getForecast(forecastInput.value);
});

forecastBtn.addEventListener('click',function(eventInfo){
    getForecast(forecastInput.value);
});



async function getForecast(location){
    try{
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7cd9c582766d45c0a25111457242206&q=${location}&days=${numberOfDays}`);
        let data = await response.json();
        if(response.ok){
            // console.log(data);
            spinner.classList.add('d-none');
            forecastContainer.classList.remove('d-none');
            displayForecast(data);
        }
    }catch(err){
        console.log(err);
    }
}
// getForecast('tOuKh');



const whatDays = document.querySelectorAll('.forecast .forecast-date .dayName');
const allMaxDegrees = document.querySelectorAll('.forecast .forecast-content .main_degree');
const allMinDegrees = document.querySelectorAll('.forecast .forecast-content .min_degree');
const forecastImgs = document.querySelectorAll('.forecast .forecast-content .stateImg');
const forecastStates = document.querySelectorAll('.forecast .forecast-content .custom');
const forecastWindStates = document.querySelectorAll('.forecast .forecast-content ul li span');
const directions = {
    'N': 'North',
    'NNE': 'North-Northeast',
    'NE': 'Northeast',
    'ENE': 'East-Northeast',
    'E': 'East',
    'ESE': 'East-Southeast',
    'SE': 'Southeast',
    'SSE': 'South-Southeast',
    'S': 'South',
    'SSW': 'South-Southwest',
    'SW': 'Southwest',
    'WSW': 'West-Southwest',
    'W': 'West',
    'WNW': 'West-Northwest',
    'NW': 'Northwest',
    'NNW': 'North-Northwest'
};



function displayForecast(threeDaysForecast){
    for(let i = 0 ; i < numberOfDays ; i++){
        const date = new Date(threeDaysForecast.forecast.forecastday[i].date);
        const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
        whatDays[i].innerHTML = dayName;
    }

    const date = new Date(threeDaysForecast.forecast.forecastday[0].date);
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
    document.querySelector('.forecast .forecast-date .toDayDate').innerHTML = `${date.getDate()}${monthName}`;

    document.querySelector('.location').innerHTML = threeDaysForecast.location.name;

    // today's Temp
    allMaxDegrees[0].innerHTML = `${threeDaysForecast.current.temp_c}<sup>o</sup>C`;
    // coming day's Max Temp
    for(let i = 1 ; i < numberOfDays ; i++){
        const dayTemp = threeDaysForecast.forecast.forecastday[i].day.maxtemp_c;
        allMaxDegrees[i].innerHTML = `${dayTemp}<sup>o</sup>C`;
    }
    // coming day's Min Temp
    for(let i = 1 ; i < numberOfDays ; i++){
        const dayTemp = threeDaysForecast.forecast.forecastday[i].day.mintemp_c;
        allMinDegrees[i-1].innerHTML = `${dayTemp}<sup>o</sup>C`;
    }

    const dayImg = `https://${threeDaysForecast.current.condition.icon}`;
    const dayState = threeDaysForecast.current.condition.text;
    forecastImgs[0].setAttribute('src',dayImg);
    forecastImgs[0].setAttribute('alt',dayState);
    forecastStates[0].innerHTML = dayState;
    for(let i = 1 ; i < numberOfDays ; i++){
        const dayImg = `https://${threeDaysForecast.forecast.forecastday[i].day.condition.icon}`;
        const dayState = threeDaysForecast.forecast.forecastday[i].day.condition.text;
        forecastImgs[i].setAttribute('src',dayImg);
        forecastImgs[i].setAttribute('alt',dayState);
        forecastStates[i].innerHTML = dayState;
    }

    forecastWindStates[0].innerHTML = `${threeDaysForecast.current.humidity}%`;
    forecastWindStates[1].innerHTML = `${threeDaysForecast.current.wind_kph}km/h`;
    forecastWindStates[2].innerHTML = `${directions[threeDaysForecast.current.wind_dir]}`;
}


const alert = document.querySelector('.alert');
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(async function(position){
        alert.innerHTML = 'Wait please..';
        let response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=geocodejson&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
        let data = await response.json();
        spinner.classList.add('d-none');
        forecastContainer.classList.remove('d-none');
        getForecast(data.features[0].properties.geocoding.state);
    },
    function(error){
        console.log(error.message);
        alert.innerHTML = 'Enter any location to start display the forecast for today and the coming 2 days..';
    });
}
else{
    alert.innerHTML = 'Enter any location to start display the forecast for today and the coming 2 days..';
}

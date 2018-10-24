const url = 'http://api.openweathermap.org/data/2.5/weather?q=';
const url5days = 'http://api.openweathermap.org/data/2.5/forecast?q=';
const urlLoc = 'http://api.openweathermap.org/data/2.5/weather?';
const urlLoc5days = 'http://api.openweathermap.org/data/2.5/forecast?';
const apiKey = '&APPID=d49fb668871e2911b9846d2dba459b7c';
const cityInfo = $('#city');

function chooseCity() {
	let cityName = $('#city-name').val();
	if(!cityName) {
		cityName = 'Warsaw'
	};
	$.ajax({
		url: `${url}${cityName}${apiKey}`,
		method: 'GET',
		success: showWeather
	});
	$.ajax({
		url: `${url5days}${cityName}${apiKey}`,
		method: 'GET',
		success: forecast
	})
};

$('#location').click(function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        return;
    }
})
function showPosition(position) {
    let lat = `lat=${position.coords.latitude}`;
    let lon = `lon=${position.coords.longitude}`;
    $.ajax({
		url: `${urlLoc}${lat}&${lon}${apiKey}`,
		method: 'GET',
		success: showWeather
	});
	$.ajax({
		url: `${urlLoc5days}${lat}&${lon}${apiKey}`,
		method: 'GET',
		success: forecast
	})
}

function showWeather(resp) {
	let tempCel = (resp.main.temp - 273.15).toFixed(2);
	let tempFahr = ((resp.main.temp - 273.15) * 1.8 + 32).toFixed(2);
	let actWeather = resp.weather[0].icon;
	let tempCelMax = (resp.main.temp_max - 273.15).toFixed(2);
	let tempCelMin = (resp.main.temp_min - 273.15).toFixed(2);
	$('#main img:last-child').remove();
	$('#main div').remove();
	cityInfo.empty();
	$('<li>').text(resp.name).appendTo(city);
	$('<li>').text(`cloudy ${resp.clouds.all}%`).appendTo(city);
	$('<li>').text(` wind speed ${resp.wind.speed}m/s wind direction `).appendTo(city).prepend('<i class="wi wi-strong-wind"></i>').append('<i class="wi wi-wind towards-'+ resp.wind.deg +'-deg"></i>');
	$('<li>').text(`humidity ${resp.main.humidity}% pressure ${resp.main.pressure}hPa`).appendTo(city);
	$('<li>').text(`temperature ${tempCel}℃ temperature-max ${tempCelMax}℃ temperature-min ${tempCelMin}℃`).appendTo(city);
	weatherCheck(actWeather, resp);
}

function weatherCheck(actWeather, resp) {
	switch(actWeather) {
		case '03d': case '04d': case '03n': case '04n':
			$('#main').append('<div class="icon cloudy"><div class="cloud"></div><div class="cloud"></div></div>');
			break;
		case '11d':
			$('#main').append('<div class="icon thunder-storm"><div class="cloud"></div><div class="lightning"><div class="bolt"></div><div class="bolt"></div></div></div>');
			break;
		case '09d': case '09n':
			$('#main').append('<div class="icon rainy"><div class="cloud"></div><div class="rain"></div></div>');
			break;	
		case '10d':
			$('#main').append('<div class="icon sun-shower"><div class="cloud"></div><div class="sun"><div class="rays"></div></div><div class="rain"></div></div>');
			break;	
		case '13d': case '13n':
			$('#main').append('<div class="icon flurries"><div class="cloud"></div><div class="snow"><div class="flake"></div><div class="flake"></div></div></div>');
			break;
		case '01d':
			$('#main').append('<div class="icon sunny"><div class="sun"><div class="rays"></div></div></div>');
			break;
		case '02d':
			$('#main').append('<div class="icon sun-shower"><div class="cloud"></div><div class="sun"><div class="rays"></div></div></div>');
			break;
		case '11n':
			$('#main').append('<div class="icon"><i class="wi wi-night-alt-thunderstorm lg"></i></div>');
			break;
		case '10n':
			$('#main').append('<div class="icon"><i class="wi wi-night-showers lg"></i></div>');
			break;	
		case '01n':
			$('#main').append('<div class="icon"><i class="wi wi-night-clear lg"></i></div>');
			break;
		case '02n':	
			$('#main').append('<div class="icon"><i class="wi wi-night-partly-cloudy lg"></i></div>');
			break;
    	default:
    		$('#main').append('<div class="icon"><i class="wi wi-fog lg"></i></div>');
	}
}

function forecast(response) {
	$('#footer h2, #footer div').remove();
	$('#footer').append('<h2>Simple 5 days forecast</h2>');
	for (var i = 0; i < response.list.length; i++) {
		let date = response.list[i].dt_txt;
		let tempCelMax = (response.list[i].main.temp_max - 273.15).toFixed(2);
		let tempCelMin = (response.list[i].main.temp_min - 273.15).toFixed(2);
		let prognosis = response.list[i].weather[0].description;
		if (i%4 === 0){
			$('#footer').append('<div><ul><li>' + '<i class="fa fa-calendar" aria-hidden="true" title="Date"></i> ' + date + '</li><li>' + '<i class="wi wi-thermometer" title="temperature-max"></i> ' + tempCelMax+'℃' + '</li><li>' + '<i class="wi wi-thermometer-exterior" title="temperature-min"></i> ' + tempCelMin + '℃' + '</li><li>' + 'Prognosis: ' + prognosis + '</li></ul></div>');
		}	
	}
}

$('#search').click(chooseCity);
$("#city-name").keypress((event) => {
  if (event.which === 13) {
    chooseCity();
  };
});

//
// My Weather Service Web-Deployable User Interface
//

// var API_URL = 'https://cgmlyqlmnf.execute-api.us-east-1.amazonaws.com/Prod/weatherservice/';
var API_URL = '';
var WEATHER_CONDITIONS = getWeatherConditions();

function getWeatherConditions() {
    
    // weather icons and condition codes : https://openweathermap.org/weather-conditions
    // d day n night

    // conditions["200"][0] --> Thunderstorm
    // conditions["200"][1] --> Thunderstorm with light rain
    // conditions["200"][2] --> 11d
    
    var conditions = [];
    conditions["200"] = ["Thunderstorm", "Thunderstorm with light rain", "11d"];
    conditions["201"] = ["Thunderstorm", "Thunderstorm with rain", "11d"];
    conditions["202"] = ["Thunderstorm", "Thunderstorm with heavy rain", "11d"];
    conditions["210"] = ["Thunderstorm", "Light thunderstorm", "11d"];
    conditions["211"] = ["Thunderstorm", "Thunderstorm", "11d"];
    conditions["212"] = ["Thunderstorm", "Heavy thunderstorm", "11d"];
    conditions["221"] = ["Thunderstorm", "Ragged thunderstorm", "11d"];
    conditions["230"] = ["Thunderstorm", "Thunderstorm with light drizzle", "11d"];
    conditions["231"] = ["Thunderstorm", "Thunderstorm with drizzle", "11d"];
    conditions["232"] = ["Thunderstorm", "Thunderstorm with heavy drizzle", "11d"];
    conditions["300"] = ["Drizzle", "Light intensity drizzle", "09d"];
    conditions["301"] = ["Drizzle", "Drizzle", "09d"];
    conditions["302"] = ["Drizzle", "Heavy intensity drizzle", "09d"];
    conditions["310"] = ["Drizzle", "Light intensity drizzle rain", "09d"];
    conditions["311"] = ["Drizzle", "Drizzle rain", "09d"];
    conditions["312"] = ["Drizzle", "Heavy intensity drizzle rain", "09d"];
    conditions["313"] = ["Drizzle", "Shower rain and drizzle", "09d"];
    conditions["314"] = ["Drizzle", "Heavy shower rain and drizzle", "09d"];
    conditions["321"] = ["Drizzle", "Shower drizzle", "09d"];
    conditions["500"] = ["Rain", "Light rain", "10d"];
    conditions["501"] = ["Rain", "Moderate rain", "10d"];
    conditions["502"] = ["Rain", "Heavy intensity rain", "10d"];
    conditions["503"] = ["Rain", "Very heavy rain", "10d"];
    conditions["504"] = ["Rain", "Extreme rain", "10d"];
    conditions["511"] = ["Rain", "Freezing rain", "13d"];
    conditions["520"] = ["Rain", "Light intensity shower rain", "09d"];
    conditions["521"] = ["Rain", "Shower rain", "09d"];
    conditions["522"] = ["Rain", "Heavy intensity shower rain", "09d"];
    conditions["531"] = ["Rain", "Ragged shower rain", "09d"];
    conditions["600"] = ["Snow", "Light snow", "13d"];
    conditions["601"] = ["Snow", "Snow", "13d"];
    conditions["602"] = ["Snow", "Heavy snow", "13d"];
    conditions["611"] = ["Snow", "Sleet", "13d"];
    conditions["612"] = ["Snow", "Light shower sleet", "13d"];
    conditions["613"] = ["Snow", "Shower sleet", "13d"];
    conditions["615"] = ["Snow", "Light rain and snow", "13d"];
    conditions["616"] = ["Snow", "Rain and snow", "13d"];
    conditions["620"] = ["Snow", "Light shower snow", "13d"];
    conditions["621"] = ["Snow", "Shower snow", "13d"];
    conditions["622"] = ["Snow", "Heavy shower snow", "13d"];
    conditions["701"] = ["Mist", "Mist", "50d"];
    conditions["711"] = ["Smoke", "Smoke", "50d"];
    conditions["721"] = ["Haze", "Haze", "50d"];
    conditions["731"] = ["Dust", "Sand or dust whirls", "50d"];
    conditions["741"] = ["Fog", "Fog", "50d"];
    conditions["751"] = ["Sand", "Sand", "50d"];
    conditions["761"] = ["Dust", "Dust", "50d"];
    conditions["762"] = ["Ash", "Volcanic ash", "50d"];
    conditions["771"] = ["Squall", "Squalls", "50d"];
    conditions["781"] = ["Tornado", "Tornado", "50d"];
    conditions["800"] = ["Clear", "Clear sky", "01d"];
    conditions["801"] = ["Clouds", "Few clouds: 11-25%", "02d"];
    conditions["802"] = ["Clouds", "Scattered clouds: 25-50%", "03d"];
    conditions["803"] = ["Clouds", "Broken clouds: 51-84%", "04d"];
    conditions["804"] = ["Clouds", "Overcast clouds: 85-100%", "04d"];

    return conditions;
}

function getWeather() {

    $("#weatherDetails").html(""); // clear
    $("#ajaxRawResponse").html(""); // clear

    // ?zip=02125&appid=e94509746fcee9d5f653dc72032d3644
    var myUrl = API_URL + "?zip=" + encodeURIComponent($('#zip').val());
    myUrl += "&appid=" +  encodeURIComponent($('#appid').val());         

    $.ajax({
        type : 'GET',
        url : myUrl,
        success : function(data) {
            try {    
                var cleanStr = JSON.stringify(data);
                $("#ajaxRawResponse").html(cleanStr);                
                var bodyObj = JSON.parse(cleanStr);
                $("#weatherDetails").html(getWeatherTableHtml($('#zip').val(), bodyObj));
            } catch (error) {
                $("#weatherDetails").html(JSON.stringify(error));
                $("#ajaxRawResponse").html("<pre>" + JSON.stringify(data) + "</pre>");
            }
        }
    });
}

function mpsToMph(mps) {
    var mph = 0;
    if (mps) {
        try {
            mph = kilometersToMiles(60 * 60 * mps / 1000);
        } catch (error) {
            mph = 0;
        }
    }
    return Number.parseFloat(mph).toFixed(1); 
}

function metersToMiles(meters) {
    var miles = 0;
    if (meters) {
        try {
            miles = meters * 0.6213712 / 1000;
        } catch (error) {
            miles = 0;
        }
    }
    return Number.parseFloat(miles).toFixed(1);
}

function kilometersToMiles(km) {
    var miles = 0;
    if (km) {
        try {
            miles = metersToMiles(km * 1000);
        } catch (error) {
            miles = 0;
        }
    }

    return Number.parseFloat(miles).toFixed(1);
}

function kelvinToFahrenheit(k) {
    var fahrenheit = 0;
    try {
        var kelvin = Number(k); // 269.13
        var base = Number("273.15");
        fahrenheit = (kelvin - base) * 9/5 + 32; // 13.10
    } catch (error) {
        fahrenheit = 0;
    }
    return fahrenheit;
}

function getWeatherImgName(iconId) {
    return iconId + "@2x.png"
}

function getWeatherIconUrl(id) {
    // if conditionId is 804 then http://openweathermap.org/img/wn/04d@2x.png
    // if iconId is 10d then http://openweathermap.org/img/wn/10d@2x.png
    var url = "";
    if (id) {
        url = "http://openweathermap.org/img/wn/" + getWeatherImgName(id);
    }
    return url;
}

function getWeatherConditionShortDescription(conditionId) {
    return WEATHER_CONDITIONS[conditionId][0];
}

function getWeatherConditionLongDescription(conditionId) {
    return WEATHER_CONDITIONS[conditionId][1];
}

function getWeatherConditionUrl(conditionId) {
    return getWeatherIconUrl(WEATHER_CONDITIONS[conditionId][2]);
}

function getWeatherConditionImg(conditionId, width) {
    var url = getWeatherConditionUrl(conditionId);
    var alt = getWeatherImgName(conditionId);
    return "<img width=\"" + width + "\" alt=\"" + alt + "\" src=\"" + url + "\" />";
}

function getWeatherIconImg(iconId, width) {
    var url = getWeatherIconUrl(iconId);
    var alt = getWeatherImgName(iconId);
    return "<img width=\"" + width + "\" alt=\"" + alt + "\" src=\"" + url + "\" />";
}

function getWeatherTableHeaderRow() {
    var headerRow = "<tr style=\"text-align:center;vertical-align:middle\">";
    headerRow += "<th>Zip</th>";
    headerRow += "<th>Locality</th>";
    // headerRow += "<th>Icon</th>";
    headerRow += "<th>Condition</th>";
    headerRow += "<th>Description</th>";
    headerRow += "<th>Current Temp<br/>(F)</th>";
    headerRow += "<th>Wind<br/>(mph)</th>";
    headerRow += "<th>Feels Like<br/>(F)</th>";
    headerRow += "<th>Visibility<br/>(mi)</th>";
    headerRow += "<th>Pressure<br/>(mbar)</th>"; // 1 mbar (millibar) = 1 hPa (hectoPascal)
    headerRow += "<th>Humidity<br/>(%)</th>";
    headerRow += "</tr>";
    return headerRow;
}

function getWeatherTableDetailsRow(zip, jsonWeatherObj) {

    // response units of measurement : https://openweathermap.org/weather-data

    var detailsRow = "<tr style=\"text-align:center;vertical-align:middle\">";
    try {
    detailsRow += "<td>" + zip + "</td>";
    detailsRow += "<td>" + jsonWeatherObj.name + "</td>";
    // detailsRow += "<td>" + getWeatherIconImg(jsonWeatherObj.weather[0].icon, "100") + "</td>";
    detailsRow += "<td>" + getWeatherConditionImg(jsonWeatherObj.weather[0].id, "100") + "</td>";
    detailsRow += "<td>" + WEATHER_CONDITIONS[jsonWeatherObj.weather[0].id][1] + "</td>";
    detailsRow += "<td>" + Math.round(kelvinToFahrenheit(jsonWeatherObj.main.temp)) + "</td>";
    detailsRow += "<td>" + mpsToMph(jsonWeatherObj.wind.speed) + "</td>";
    detailsRow += "<td>" + Math.round(kelvinToFahrenheit(jsonWeatherObj.main.feels_like)) + "</td>";
    detailsRow += "<td>" + metersToMiles(jsonWeatherObj.visibility) + "</td>";
    detailsRow += "<td>" + jsonWeatherObj.main.pressure + "</td>";
    detailsRow += "<td>" + jsonWeatherObj.main.humidity + "</td>";
    detailsRow += "</tr>";
    } catch (error) {
        detailsRow = "<tr style=\"text-align:center;vertical-align:middle\">Error : " + error + "</tr>";
    }
    return detailsRow;
}

function getWeatherTableHtml(zip, jsonWeatherObj) {
    var html = "<table border=\"1\">\n";
    html += getWeatherTableHeaderRow();
    html += getWeatherTableDetailsRow(zip, jsonWeatherObj);
    html += "</table>";

    return html; 
}

function processEnter(event) {
    if (event && event.keyCode == 13) {
        // user hit Enter key
        $("#submitButton").click();
    }
    return false;
}

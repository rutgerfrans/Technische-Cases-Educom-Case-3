window.onload = Init();

// Default Chart
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // x-as (dit wordt een lijst met alle dates tussen en met de start en end date)
        datasets: [{
            label: "Temperature", 
            data: [], // dit wordt een lijst met de temperatuur op de verschillende dagen
        }]
    },
    options: {
        responsive: false,
        scales: {
            x: {
                display: true
            },
            y: {
                beginAtZero: true,
                display: true
            }
        }
    }
});

function Init(){
    PopulateDropdownList('https://data.buienradar.nl/2.0/feed/json');
}


// Create List with all stations to choose from
function PopulateDropdownList(url){
    fetch(url).then(response => { 
        response.json().then(data => {
            data.actual.stationmeasurements.forEach(station => {
                var option = document.createElement('option');
                option.value = station.stationname;
                document.getElementById("DropDown").appendChild(option);
            });
        });
    });
}

// Gets all requested data from Backend, based on station and startdate
function GetAPI(url){
    document.getElementById("WeatherInfo").innerHTML = "";
    document.getElementById('InputMeetstation').value != "" ? fetch(url).then(response => { 
        response.json().then(data => {
            data.Stations.forEach(station => {
                PopulateWeatherData(station);
            })
            PopulateWeatherGraph(data.Stations);
        });
    }): null;
}

// Selects which data is needed to show and adds this to "WeatherInfo" div
function PopulateWeatherData(MeetStation){
    var List = document.createElement('ul');

    var Fields = [["Station name: ",MeetStation.stationname],["Date: ", MeetStation.date],["Weather description: ",MeetStation.weatherdescription],["Temperature: ",MeetStation.temperature + "°C"],
        ["Feel temperature: ",MeetStation.feeltemperature + "°C"],["Ground temperature: ",MeetStation.groundtemperature + "°C"],["Humidity: ",MeetStation.humidity + "%"],
        ["Rainfall Last 24 hours: ",MeetStation.rainFallLast24Hour + "mm"],["Rainfall last hour: ",MeetStation.rainFallLastHour + "mm"]];

    Fields.forEach(Field => {
        var item = document.createElement("li");
        item.innerHTML = Field[0] + " " + Field[1];
        List.appendChild(item);
    });    
    document.getElementById("WeatherInfo").appendChild(List);
}

// Populate weather graph
function PopulateWeatherGraph(weatherData){
    // Sort stations on data
    weatherData = SortData(weatherData);

    // Clear data
    myChart.data.datasets[0].data = [];
    myChart.data.labels = [];

    // Populate data
    weatherData.forEach(station =>{
        myChart.data.datasets[0].data.push(station.temperature);
        myChart.data.labels.push(station.date);
    });

    // Update chart
    myChart.update();
}

// Sorts all Data in case Data is not saved right to the backend
function SortData(Data){
    let sortedData = []
    let firstDate = new Date(Data[0].date).toLocaleDateString("en-CA")

    Data.forEach(station => {
        let date = new Date(station.date).toLocaleDateString("en-CA");
        if (firstDate > date){
            firstDate = date;
            sortedData.unshift(station);
        }else{
            sortedData.push(station);
        }
    })
    return sortedData;
};
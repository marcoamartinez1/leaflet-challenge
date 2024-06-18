// Stores the API endpoint in a variable
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Get request to the query URL
d3.json(queryUrl).then(function(data) {
    createFeatures(data.features);
});

// Return color for depth of earthquake
function depthColor(depth) {
  
    // I found the ternary operator while searching for help on how to use if/else statements
    // I found the color codes on tristen.ca colorpicker for data page
    return depth > 500 ? '#DE9438' :
            depth > 400 ? '#DA9C34' :
            depth > 300 ? '#D5A431' :
            depth > 200 ? '#CFAC30' :
            depth > 160 ? '#C8B432' :
            depth > 140 ? '#C0BC36' :
            depth > 120 ? '#B7C33D' :
            depth > 100 ? '#ADCB46' :
            depth > 80 ? '#A2D250' :
            depth > 60 ? '#96D95D' :
            depth > 40 ? '#88DF6A' :
            depth > 20 ? '#79E679' :
                        '#68EC89'
}

//Function to create the map's features
function createFeatures(earthquakeData) {
    //Each feature will have a popup that describes the place, magnitude, and time of the earthquake
    function onEachFeature_func(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
        <p>Earthquake Magnitude: ${feature.properties.mag}</p>
        <p>Earthquake Depth: ${feature.geometry.coordinates[2]} Km</p>
        <p>${new Date(feature.properties.time)}</p>`);
    }

//A GeoJSON layer that pulls the information from the earthquakeData object to style the markers
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature_func,
        pointToLayer: function (feature, latlng){
        return L.circleMarker(latlng, {
            radius: feature.properties.mag * 2,
            fillColor: depthColor(feature.geometry.coordinates[2]),
            color: depthColor(feature.geometry.coordinates[2]),
            opacity: 0.9,
            fillOpacity: 0.9
            });
        }
    });
// calls the createMap function with the earthquakes argument to initialize the map
createMap(earthquakes);
}

function createMap(earthquakes){
    // street map base layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })


  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  // I tried to center to be able to see the most amount of data
    let myMap = L.map("map", {
        center: [
            27.2630903, 55.5808497
        ],
        zoom: 2,
        layers: [street, earthquakes]
    });

// legend code was derived from the leafletjs documentation found linked in the classwork 
// sets legend placement
    let legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend'),
            depthRanges = [0, 20, 40, 60, 80, 100, 120, 140, 160, 200, 300, 400, 500],
            labels = [];

        // Loop through our depth intervals and generate a label with a colored square for each interval
        for (let i = 0; i < depthRanges.length; i++) {
            div.innerHTML +=
                '<i style="background:' + depthColor(depthRanges[i] + 1) + '"></i> ' +
                depthRanges[i] + (depthRanges[i + 1] ? '&ndash;' + depthRanges[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(myMap);

}

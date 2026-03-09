mapboxgl.accessToken = 'pk.eyJ1IjoiZ2FyZGVtYXJpbjc3IiwiYSI6ImNta2VhaHhudTA1YjUzZXB3N2tlbnVuem4ifQ.Y50vLZNgH1HxQuFuhIFodA';

// Create the map
const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-79.3832, 43.6532],
    zoom: 11
});

// Add zoom in/out buttons
map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

map.on('load', function() {


    map.addSource('ice-rinks', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/gardemarin77/labnew/main/Indoor%20Ice%20Rinks%20-%204326.geojson'
    });

    // Draw circles on the map, colour-coded by ice pad size category
    map.addLayer({
        id: 'ice-rinks-layer',
        type: 'circle',
        source: 'ice-rinks',
        paint: {
            // Change circle size based on zoom level
            'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                10, 5,
                14, 12
            ],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
            'circle-color': [
                'match', ['get', 'Ice Pad Size Category'],
                'NHL(200X85)',                 '#ff1a1a',
                'International(200X100)',       '#ff9900',
                'Regular(185X85)',              '#00cc44',
                'Undersized(less than 185X85)', '#cc00ff',
                'None',                         '#00cfff',
                '#aaaaaa'
            ]
        }
    });

    // Show a popup when click on a rink
    map.on('click', 'ice-rinks-layer', function(e) {
        var props = e.features[0].properties;

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
                '<strong>' + props['Parent Asset Name'] + '</strong><br>' +
                props['Ice Pad Size Category'] + '<br>' +
                props['Address']
            )
            .addTo(map);
    });
});

// Filter rinks by ice pad size category when a button is clicked
function filterRinks(category) {
    if (category === 'all') {
        // Remove the filter to show all rinks
        map.setFilter('ice-rinks-layer', null);
    } else {
        // Only show rinks that match the selected category
        map.setFilter('ice-rinks-layer', ['==', ['get', 'Ice Pad Size Category'], category]);
    }
}
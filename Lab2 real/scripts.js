mapboxgl.accessToken = 'pk.eyJ1IjoiZGFlbGVuZyIsImEiOiJjbDl5d3h6NzkwOTdoM29xb20xYzJ3NmZsIn0.sMhj9jD84igqnZdX08l33A'
const map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-122.4443, 47.2529], // starting position
  zoom: 10 // starting zoom
});

// map.addImage('hospital-15');
// map.addImage('library-15.png');

map.on('load', function() {
    // Loads in the Hospitals layer 
    map.addLayer({
      id: 'hospitals',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: hospitalPoints
      },
      layout: {
        'icon-image': 'hospital-15',
        'icon-allow-overlap': true
      },
      paint: { }
    });
    // loads in the libraries layer 
    map.addLayer({
      id: 'libraries',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: libraryPoints
      },
      layout: {
        'icon-image': 'library-15',
        'icon-allow-overlap': true
      },
      paint: { }
    });
      
  });

// This is a pop up that happens when the hospitals are clicked
var popup = new mapboxgl.Popup();
map.on('click', 'hospitals', function(e) {
  var feature = e.features[0];
  popup.setLngLat(feature.geometry.coordinates)
    .setHTML('Hospital Name: ' + feature.properties.NAME + '<br>' +  'Hospitals Address: ' + feature.properties.ADDRESS)
    .addTo(map);
});

// changes pointer when hovering over hospitals 
map.on('mouseenter', 'hospitals', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
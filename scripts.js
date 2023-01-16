mapboxgl.accessToken = 'pk.eyJ1IjoiZGFlbGVuZyIsImEiOiJjbDl5d3h6NzkwOTdoM29xb20xYzJ3NmZsIn0.sMhj9jD84igqnZdX08l33A'
const map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-122.4443, 47.2529], // starting position
  zoom: 10, // starting zoom
  attributionControl: false
}).addControl(new mapboxgl.AttributionControl({
    customAttribution: 'The Hospital and Library locations are courtesy of the Pierce County Open GeoSpatial Data portal: <a href="https://gisdata-piercecowa.opendata.arcgis.com/datasets/public-health-care-facilities/explore"> Hospitals </a> , <a href="https://gisdata-piercecowa.opendata.arcgis.com/datasets/libraries/explore"> Libraries</a>'
    }));

alert('This is a map of Libraries and Hospitals within Pierce county, if you select a Library it will tell you where the nearest Hospital is');
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
    // loads in the blank layer that will be used to display the nearest hospital 
    map.addSource('nearest-hospital', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
          ]
        }
      });
  });

// This is a pop up that happens when the hospitals are clicked lets user know hospital Name and Address
var popup = new mapboxgl.Popup();
map.on('click', 'hospitals', function(e) {
    var feature = e.features[0];
    popup.setLngLat(feature.geometry.coordinates)
        .setHTML('Hospital Name: ' + feature.properties.NAME + '<br>' +  'Hospitals Address: ' + feature.properties.ADDRESS)
        .addTo(map);
});

// When clicking on the libraries 
map.on('click', 'libraries', function(f) {
    // This variable is the library that is clicked 
    var refLibrary = f.features[0];
    // this variable is the point of the nearest hospital from the clicked library
    var nearestHospital = turf.nearest(refLibrary, hospitalPoints);
    // this variable is the coordiante points of the selected library (made obsolete but left this to show it can be done as variable for future self) 
    // var refLibraryCoor = refLibrary.geometry.coordinates; 
    // this dakes the coordinate points of the selected library and the nearest hospital and finds a distance (challanged myself to do this in one line of code)
    var distance = (turf.distance(refLibrary.geometry.coordinates, nearestHospital, {units:'miles'})).toFixed(2);
    // This fixes the distance number to only 2 decimal points out (made obsolete but left this to show making a number shorter can be done in a variable for future self)
    // var fixDist = distance.toFixed(2);
    // Update the 'nearest-hospital' data source to include the nearest library (this is for the nearestHospital highlight)
	map.getSource('nearest-hospital').setData({
      	    type: 'FeatureCollection',
      	    features: [
               nearestHospital
      	    ]
    	});
   
	// Create a new circle layer from the 'nearest-hospital' data source (this is for the nearestHospital highlight)
	map.addLayer({
      	id: 'nearestHospitalLayer',
	    type: 'circle',
	    source: 'nearest-hospital',
	    paint: {
		'circle-radius': 12,
		'circle-color': '#486DE0'
	    }
	}, 'hospitals');
    // Gives information on the library clicked and its nearest hospital 
    popup.setLngLat(refLibrary.geometry.coordinates)
        .setHTML('<b>' + refLibrary.properties.NAME + '</b><br>The nearest hospital is ' + nearestHospital.properties.NAME + ', located at ' + nearestHospital.properties.ADDRESS + '. It is ' + distance + ' miles away.')
        .addTo(map);

});

// changes pointer when hovering over hospitals 
map.on('mouseenter', 'hospitals', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'hospitals', () => {
    map.getCanvas().style.cursor = '';
  });
// changes pointer when hovering over libraries 
  map.on('mouseenter', 'libraries', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'libraries', () => {
    map.getCanvas().style.cursor = '';
  });

//   Attribution
// const maps = new mapboxgl.Map({attributionControl: false})
// .addControl(new mapboxgl.AttributionControl({
// customAttribution: 'Map design by me'
// }));
maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
    container: 'map', 
    style: maptilersdk.MapStyle.STREETS,
    center: parseFloat(longi) && parseFloat(lati)?[parseFloat(longi), parseFloat(lati)]:[73.856722,18.5204], 
    zoom: 14, 
});

const markerHeight = 50, markerRadius = 10, linearOffset = 25;
const popupOffsets = {
    'top': [0, markerHeight],  
    'top-left': [0, markerHeight], 
    'top-right': [0, markerHeight], 
    'bottom': [0, -markerHeight],  
    'bottom-left': [-linearOffset, -markerHeight], 
    'bottom-right': [linearOffset, -markerHeight], 
    'left': [-markerRadius, markerHeight], 
    'right': [markerRadius, markerHeight]  
};

// Create a popup
const popup = new maptilersdk.Popup({ offset: popupOffsets, closeOnClick: false })
    .setHTML('<h6>Hello, this is the place where you will be!</h6>');

// Create a custom element for the animated marker
const markerElement = document.createElement('div');
markerElement.className = 'animated-marker';

// Create a marker and attach the popup to it
const marker = new maptilersdk.Marker({ element: markerElement })
    .setLngLat(parseFloat(longi) && parseFloat(lati)?[parseFloat(longi), parseFloat(lati)]:[73.856722,18.5204])
    .setPopup(popup) 
    .addTo(map);

// Ensure the popup is visible by default
marker.togglePopup();

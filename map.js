const apiKey = 'pk.eyJ1IjoibG92ZWxlaTIyIiwiYSI6ImNrd3hramJ2bjBmMXUybm1uYTdwY3loeDUifQ.NzQovNr2kSwQLmOTZRUjKQ';

const mymap = L.map('map').setView([60.21397, 24.64900], 12);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: apiKey
}).addTo(mymap);

// Adding Marker
const marker1 = L.marker([60.221473, 24.609861]).addTo(mymap);
const marker2 = L.marker([60.244654, 24.607801]).addTo(mymap);
const marker3 = L.marker([60.212946, 24.664106]).addTo(mymap);



// Adding Popup message
let template1 = `
<h3>Gumbölentie 20</h3>
<div style="text-align:center">
    <img width="150" height="150" src="1.jpg"/>
</div>
`;
let template2 = `
<h3>Hakjärvi</h3>
<div style="text-align:center">
    <img width="150" height="150" src="2.jpg"/>
</div>
`;

let template3 = `
<h3>Lehtimäentie 2</h3>
<div style="text-align:center">
    <img width="150" height="150" src="3.jpg"/>
</div>
`;



marker1.bindPopup(template1);
marker2.bindPopup(template2);
marker3.bindPopup(template3);

// Adding circle
const circle1 = L.circle([60.221473, 24.609861],{
    radius:500,
    color:'green'
}).addTo(mymap)

const circle2 = L.circle([60.244654, 24.607801],{
    radius:500,
    color:'orange'
}).addTo(mymap)

const circle3 = L.circle([60.212946, 24.664106],{
    radius:500,
    color:'purple'
}).addTo(mymap)

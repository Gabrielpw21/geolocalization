var map = L.map('map').setView([-15.607398, -56.082432], 4);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

navigator.geolocation.watchPosition(success, error, {
    enableHighAccuracy: true
});

let marker, circle, zoomed;

function success(pos) {
    const lat = pos.coords.latitude;
    const long = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    console.log(`Latitude: ${lat}, Longitude: ${long}, Accuracy: ${accuracy}`);

    if (marker) {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }

    marker = L.marker([lat, long]).addTo(map);
    circle = L.circle([lat, long], {
        radius: accuracy
    }).addTo(map);

    if (!zoomed) {
        zoomed = map.fitBounds(circle.getBounds());
    }
}

function error(err) {
    if (err.code === 1) {
        alert("Por favor, permita a geolocalização.");
    } else {
        alert("Não foi possível pegar a sua geolocalização.");
    }
}
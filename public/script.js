const map = L.map('map').setView([-15.607398, -56.082432], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const socket = io();

let marker, circle;

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
    circle = L.circle([lat, long], { radius: accuracy }).addTo(map);

    socket.emit('updateLocation', { latitude: lat, longitude: long, accuracy: accuracy });
}

function error(err) {
    if (err.code === 1) {
        alert("Por favor, permita a geolocalização.");
    } else {
        alert("Não foi possível pegar a sua geolocalização.");
    }
}

navigator.geolocation.watchPosition(success, error, { enableHighAccuracy: true });

socket.on('locationUpdate', (locations) => {
    console.log('Atualização de localizações:', locations);
    for (let id in locations) {
        const userLocation = locations[id];
        L.marker([userLocation.latitude, userLocation.longitude])
            .addTo(map)
            .bindPopup(`Usuário ${id}: ${userLocation.latitude}, ${userLocation.longitude}`)
            .openPopup();
    }
});

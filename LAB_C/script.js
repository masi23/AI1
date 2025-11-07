const defaultLocation = { latitude: 51.505, longitude: -0.09 };
let selectedLocation = null;

console.log(defaultLocation);

let map = L.map("map").setView(
  [defaultLocation.latitude, defaultLocation.longitude],
  18
);
L.tileLayer.provider("Esri.WorldImagery").addTo(map);
let marker = L.marker([
  defaultLocation.latitude,
  defaultLocation.longitude,
]).addTo(map);
marker.bindPopup("Twoja lokaliacja");

function getLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation unavailable");
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      selectedLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      map.setView([selectedLocation.latitude, selectedLocation.longitude]);
    },
    (positionError) => {
      console.error(positionError);
    },
    {
      enableHighAccuracy: false,
    }
  );
}

document.getElementById("my-location").addEventListener("click", (event) => {
  getLocation();
});

document.getElementById("take-photo").addEventListener("click", function () {
  leafletImage(map, function (err, canvas) {
    let rasterMap = document.getElementById("rasterMap");
    let rasterContext = rasterMap.getContext("2d");

    rasterContext.drawImage(canvas, 0, 0);
  });
});

// let latitude = 0;
// let longitude = 0;

// navigator.geolocation.getCurrentPosition((position) => {
//   latitude = position.coords.latitude;
//   longitude = position.coords.longitude;

//   var map = L.map("map").setView([latitude, longitude], 15);

//   L.tileLayer(
//     "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
//     {
//       attribution:
//         "© Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
//       maxZoom: 18,
//     }
//   ).addTo(map);
// });

let latitude = 0;
let longitude = 0;

navigator.geolocation.getCurrentPosition((position) => {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  var map = L.map("map").setView([latitude, longitude], 15);

  L.tileLayer(
    "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "© Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      maxZoom: 18,
    }
  ).addTo(map);
});

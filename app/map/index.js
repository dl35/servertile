/**
 *
 */

/*fetch('/geojson/country')
  .then(res => res.json())
  .then(main);*/

main();

// function main(geojson) {
function main() {
  const countries =  [] ;
  // geojson.features.map(f => f.properties.name.toLowerCase());

  const map = L.map('map', {
    center: {
      lat: 46.8,
      lng: 2
    },
    zoom: 6,
     minZoom: 6,
            maxZoom: 13,
    preferCanvas: false,
  });

 //L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

	L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(map);

  const url = '/{z}/{x}/{y}?pbf=true';
  const vtLayer = window.vtLayer = new L.VectorTiles(url, {
    getFeatureId: f => f.properties.nom_dept.toLowerCase(),
     style : { },
      debug: false,
  }).addTo(map);

  



  L.GridLayer.DebugCoords = L.GridLayer.extend({
    createTile: function (coords, done) {
        var tile = document.createElement('div');
        //this adds tile coordinates; you may or may not want this
        tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
        tile.style.outline = '1px solid red';

        /* // you don't need this artificial timeout for your application
        setTimeout(function () {
                done(null, tile);   // Syntax is 'done(error, tile)'
        }, 500 + Math.random() * 1500);
        */

        return tile;
    }
});

L.gridLayer.debugCoords = function(opts) {
    return new L.GridLayer.DebugCoords(opts);
};
var deb = new L.gridLayer.debugCoords().addTo(map); ;



//map.addLayer( L.gridLayer.debugCoords() );









  var hoverHighlight = true;

  function highlightOnHover(e) {
    // reset all feature styles
    for (let i = 0; i < countries.length; i++) {
      vtLayer.setFeatureStyle(countries[i], Object.assign(L.Path.prototype.options, { fill: true }));
    }
    const buf = .00001;
    const { lat, lng } = e.latlng;
    vtLayer.search(
      L.latLng({ lat: lat - buf, lng: lng - buf }),
      L.latLng({ lat: lat + buf, lng: lng + buf })
    ).forEach(id => vtLayer.setFeatureStyle(id, { color: 'green' }));
  }

  document.getElementById('hover-radio').onclick = e => {
    hoverHighlight = !hoverHighlight;
    e.target.checked = hoverHighlight;
    map[hoverHighlight ? 'on' : 'off']('mousemove', highlightOnHover);
  };

 
 
 /*
  document.getElementById('search').onkeyup = e => {
    // reset all feature styles
    for (let i = 0; i < countries.length; i++) {
      vtLayer.setFeatureStyle(countries[i], Object.assign(L.Path.prototype.options, { fill: true }));
    }
    const q = e.target.value.toLowerCase();
    if (!q) {
      return;
    }
    countries
      .filter(c => c.indexOf(q) > -1)
      .forEach(id => vtLayer.setFeatureStyle(id, { color: 'black' }));
  };
*/
  
  
  /*
  document.getElementById('cache-size-input').onchange = e => {
    const cacheSize = +e.target.value;
    document.getElementById('cache-size').innerHTML = cacheSize;
    vtLayer.setTileCacheSize(cacheSize);
  };
*/


}

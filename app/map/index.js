/**
 *
 */
//http://www.programmersought.com/article/4311390269/

/*fetch('/geojson/country')
  .then(res => res.json())
  .then(main);*/
/*

le fichier de couverture : 
/meteo/shared/data/msp-apic/couverture

les fichiers shape de datas 
/meteo/shared/data/msp-apic/shp-data/fr

les fichiers de données

*/

var alertes = { deps: [], communes: [] };
var reseaux = [];


function initReseau() {
  var deb = true;
  var mhtml = "";
  var n1 = 0;
  var n2 = 0;
  var nc = 0;
  reseaux.forEach((item, value) => {

    var chk = "";
    if (deb) {
      chk = "checked=\"checked\"";
      deb = false;
      nc = item.n_c;
      n2 = item.n2;
      n1 = item.n1;
    }



    mhtml += "<tr><td>";
    mhtml += "<input " + chk + " type=\"radio\" name=\"reseau\" value=\"" + item.date + "\" onclick=\"switchReseau('" + item.n2 + "','" + item.n1 + "','" + item.n_c + "');return true;\"></input>";
    mhtml += "<td>" + item.date_str + "</td>";
    if (item.n2 > 0)
      mhtml += "<td class='n2' width='10' >" + item.n2 + "</td>";
    if (item.n1 > 0)
      mhtml += "<td class='n1' width='10' >" + item.n1 + "</td>";
    if (item.n_c > 0)
      mhtml += "<td class='cn' width='10' >" + item.n_c + "</td>";

    mhtml += "</tr>";
  })

  $("#treseaux").find('tbody').append(mhtml);
  setLegende(n2, n1, nc);

}


var noncouverte = {};
$.getJSON("noncouverte2.json", function (json) {
  noncouverte = json.list;
});

// load last data ....

$.getJSON("../get_alertes.php?origin=fr&date=last", function (json) {
  alertes.deps = json.deps;
  alertes.communes = json.communes;
  reseaux = json.reseaux;
  if (json.date_str != undefined) {
    $("#date_str").html(json.date_str)
  } else {
    $("#date_str").html("")
  }
  initReseau();
  main();
});


function setLegende(n2, n1, nc) {


  var v = "Aucune commune ne subit des pr\u00e9cipitations tr\u00e8s intenses";
  if (n2 == 1) {
    v = "1 commune subit des pr\u00e9cipitations tr\u00e8s intenses";
  } else if (n2 > 1) {
    v = n2 + " communes subissent des pr\u00e9cipitations tr\u00e8s intenses";
  }

  $("#spn2").text(v);

  var v = "Aucune commune ne subit des pr\u00e9cipitations intenses";
  if (n1 == 1) {
    v = "1 commune subit des pr\u00e9cipitations intenses";
  } else if (n1 > 1) {
    v = n1 + " communes subissent des pr\u00e9cipitations intenses";
  }
  $("#spn1").text(v);

  var v = "Aucune commune indisponible";
  if (nc == 1) {
    v = "1 commune est indisponible";
  } else if (nc > 1) {
    v = nc + " communes sont indisponibles";
  }

  $("#spnc").text(v);
}



function switchReseau(n2, n1, nc) {
  var reseau = $("input:radio[name=reseau]:checked").val();

  var url = '../get_alertes.php?origin=fr&date=' + reseau;
  $.getJSON(url, function (json) {
    alertes.deps = json.deps;
    alertes.communes = json.communes;
    if (json.date_str != undefined) {
      $("#date_str").html(json.date_str)
    } else {
      $("#date_str").html("")
    }
    redraw();

    setLegende(n2, n1, nc);

  });

}



var tilesPbfLayer;
function redraw() {
  tilesPbfLayer.redraw();

}




function main() {

  const map = L.map('map', {
    center: {
      lat: 46.8,
      lng: 2
    },
    zoom: 6,
    minZoom: 6,
    maxZoom: 13,
    preferCanvas: true,
  });



  //L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  //L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // console.log( map.getBounds() ) ;
  // console.log(getVisibleTilesCoords(map));

  //  const url = '/{z}/{x}/{y}?pbf';
  const url = '/pbf/{z}/{x}/{y}.pbf';

  var openmaptilesVectorTileOptions = {
    rendererFactory: L.canvas.tile,
    vectorTileLayerStyles: {
      dep: function (properties, zoom) {
        return styleDep(properties, zoom)
      },
      communes: function (properties, zoom) {
        return styleCommunes(properties, zoom)
      },
      // non surveillées
      cnc: function (properties, zoom) {
        return styleCnc(properties, zoom)
      },

      /*   eau: function(properties ,zoom) {
                            return styleEau(properties ,zoom)
                                        } ,*/
    },
    interactive: true,
    minZoom: 6,
    maxZoom: 13,
    getFeatureId: f => { (f.properties.dep) ? f.properties.dep : f.properties.insee },

  };

  var popup = L.popup({
    className: "custompopup"
  });





  tilesPbfLayer = L.vectorGrid.protobuf(url, openmaptilesVectorTileOptions)
    .on('mouseover', function (e) {
      if (map.getZoom() >= 10) {
        if (e.layer)
          popup.setLatLng(e.latlng);
        popup.setContent(e.layer.properties.nom);
        popup.openOn(map);
      } else {
        map.closePopup();

      }
    }).addTo(map);


  tilesPbfLayer.bindPopup(popup);


  /////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////style departements
  function styleDep(properties, zoom) {

    var fill = false;
    var weight = 0.8;
    var fillcolor = 'white';
    var fillOpacity = 0;
    if (zoom < 9) {

      alertes.deps.forEach((item, value) => {

        if (properties.dep == item.id) {
          if (item.c == 2) fillcolor = '#ff00de';
          else if (item.c == 1) fillcolor = '#8300ff';


          fillOpacity = 0.6;
          fill = true;
        }

      })

    }

    return {
      // fill: true is needed
      fill: fill,
      fillColor: fillcolor,
      fillOpacity: fillOpacity,
      opacity: 0.1,
      stroke: true,
      color: "#000000",
      weight: weight,
      icon: new L.Icon.Default()
    };
  }
  /////////////////////////////////////////////////////////
  //////communes non surveillées
  function styleCnc(properties, zoom) {

    var fill = true ;
    var weight = 0.7 ;
    var fillcolor = 'gray' ;
    var fillOpacity = 0.5 ;
    
    return {
    
           fill: fill,
           fillColor: fillcolor ,
           fillOpacity: fillOpacity,
           stroke: false,
           color: "gay",
           weight: weight
       };
  }
  /////////////////////////////////////////style communes
  function styleCommunes(properties, zoom) {

    var fillcolor = '#e0e0d2';
    var fillOpacity = 0.5;

    var isalerte = false;


    alertes.communes.forEach((item, value) => {

      //  console.log( item.id );
      var insee = item.id.substring(0, 5);

      if (properties.insee == insee) {
        if (item.c == 2) fillcolor = '#ff00de';
        else if (item.c == 1) fillcolor = '#8300ff';

        fillOpacity = 0.6;
        isalerte = true;
      }

    });

    if (!isalerte) {

      var dep = properties.insee.substring(0, 2);

      if (noncouverte[dep] !== undefined) {
        var l = noncouverte[dep];
        var s = properties.insee.substring(2, 5);

        if (l.indexOf(s) != -1) {
          fillcolor = 'gray';
          fillOpacity = 0.4;

        }

      }

    }


    return {
      fill: true,
      fillColor: fillcolor,
      fillOpacity: fillOpacity,
      stroke: true,
      color: "#595959",
      weight: 0.4
    };

  }
  ////////////////////////////////////////////////////////////////////////////////////////
  function styleEau(properties, zoom) {

    var fillcolor = '#A52A2A';
    // var fillOpacity = 0.9 ;

    return {

      //fill: false,
      //fillColor: fillcolor ,
      //fillOpacity: fillOpacity,
      stroke: true,
      color: "#A52A2A",
      weight: 2.0
    };

  }
  ///////////////////////////////////////////////////////////////////////////////////////

  function getVisibleTilesCoords(map) {

    // get bounds, zoom and tileSize        
    var bounds = map.getPixelBounds();
    var zoom = map.getZoom();
    var tileSize = 256;
    var tileCoordsContainer = [];


    // get NorthWest and SouthEast points
    var nwTilePoint = new L.Point(Math.floor(bounds.min.x / tileSize),
      Math.floor(bounds.min.y / tileSize));

    var seTilePoint = new L.Point(Math.floor(bounds.max.x / tileSize),
      Math.floor(bounds.max.y / tileSize));

    // get max number of tiles in this zoom level
    var max = map.options.crs.scale(zoom) / tileSize;

    // enumerate visible tiles 
    for (var x = nwTilePoint.x; x <= seTilePoint.x; x++) {
      for (var y = nwTilePoint.y; y <= seTilePoint.y; y++) {

        var xTile = Math.abs(x % max);
        var yTile = Math.abs(y % max);

        tileCoordsContainer.push({ 'x': xTile, 'y': yTile });
        //console.log('info ' + x + ' ' + y);
        //console.log('tile ' + xTile + ' ' + yTile);
      }
    }

    return tileCoordsContainer;

  };


}


















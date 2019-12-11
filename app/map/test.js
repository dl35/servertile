/**
 *
 */
//http://www.programmersought.com/article/4311390269/

/*fetch('/geojson/country')
  .then(res => res.json())
  .then(main);*/


alertes = {
deps :[ {dep:35 , c:3 } ,  {dep:31 , c:2 } ],
communes :[ {insee:35206 , c:3 } ,{insee:35266 , c:3 },{insee:35066 , c:3 },
{insee:35047 , c:3 },{insee:35235 , c:3 },{insee:35328 , c:3 },
{insee:31555 , c:2 },{insee:31557 , c:2 },
{insee:35288 , c:4 }
]
};

var noncouverte = {};
$.getJSON("noncouverte2.json", function(json) {
    noncouverte = json.list ;
    ///console.log( noncouverte ) ;
});

 

  id = 0;
  idc = 0 ;
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
      preferCanvas: true,
    });
  


   //L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
   //L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(map);

   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
  
  // console.log( map.getBounds() ) ;
  // console.log(getVisibleTilesCoords(map));

    const url = '/{z}/{x}/{y}?pbf';
   // const url = '/tiles/{z}/{x}/{y}.pbf';
    var openmaptilesVectorTileOptions = {
         rendererFactory: L.canvas.tile,
         vectorTileLayerStyles: {
			dep: function(properties ,zoom) { 
                return styleDep(properties ,zoom) 
            },
            
           communes: function(properties ,zoom) {
                return styleCommunes(properties ,zoom)
                            } ,   
  
        /*   eau: function(properties ,zoom) {
                                return styleEau(properties ,zoom)
                                            } ,*/
		},
    
       interactive: true,
        maxZoom: 14,
        
        getFeatureId: f => { ( f.properties.dep ) ?  f.properties.dep  : f.properties.insee } ,
        
    };

    var popup = L.popup();

    var tooltip = L.tooltip();

    var tilesPbfLayer = L.vectorGrid.protobuf(url, openmaptilesVectorTileOptions)
        .on('mouseover'  , function(e) {
          if( map.getZoom() < 9  ) {
            if ( e.layer  )
               // tooltip.setContent(e.layer.properties.nom);
               alert('ok');
          }
        })
        .on('mouseout'  , function(e) {
          if( map.getZoom() < 9  ) {
            if (e.layer  )
                //tooltip.setContent('');
                alert('ko');
          }
        })
        
        .on('click', function(e) {
      
       if( map.getZoom() < 9  ) {
        if (e.layer  )
            popup.setContent(e.layer.properties.nom)
           
        if (id != 0) {
            tilesPbfLayer.setFeatureStyle(id , {
                fill: true,
                fillColor: 'red' ,
                fillOpacity: 0.1,
                stroke: true,
                color: "#595959",
                weight: 0.1
            });
        }
        id = e.layer.properties.dep ;

                setTimeout(function() {
                    tilesPbfLayer.setFeatureStyle(id, {
                        fillColor: 'green' ,
                weight: .5,
                    }, 100);
                });

       } else {

        // var v = (e.layer.properties.CP ) ? e.layer.properties.CP : e.layer.properties.NAME
        var v =  e.layer.properties.nom ;
        popup.setContent(v) ;
   
        if (id != 0) {
            tilesPbfLayer.setFeatureStyle(id , {
                     
                fill: true,
                fillColor: 'gray' ,
                fillOpacity: 0.1,
                stroke: true,
                color: "#595959",
                weight: 0.8
            });
        }
        id = e.layer.properties.nom ;
                setTimeout(function() {
                    tilesPbfLayer.setFeatureStyle(id, {
                        fillColor: 'orange' ,
                weight: .5,
                    }, 100);
                });



       }

       
				


    }).addTo(map);;
  

 tilesPbfLayer.bindPopup(popup);

 tilesPbfLayer.bindTooltip(tooltip);

 //////style departements
  function styleDep(properties ,zoom) {

    var fill = false ;
    var weight = 0.8 ;
    var fillcolor = 'white' ;
    var fillOpacity = 0 ;
    if( zoom < 9 ) {

        alertes.deps.forEach((item, value) => {

            if( properties.dep == item.dep ) {
                if ( item.c  == 3 )  fillcolor ='red' ;
                else fillcolor ='orange' ;

                fillOpacity = 0.6 ;
                fill = true ;
            }
           
          })
       
    }    

       return {
           // fill: true is needed
           fill: fill,
           fillColor: fillcolor ,
           fillOpacity: fillOpacity,
           opacity: 0.1,
           stroke: true,
           color: "#000000",
           weight: weight,
            icon: new L.Icon.Default()
       };
  }
    
  //////style communes
  function styleCommunes(properties ,zoom) {

    var fillcolor = '#e0e0d2' ;
    var fillOpacity = 0.5 ;

    var isalerte = false ;

  
    alertes.communes.forEach((item, value) => {

       
        if( properties.insee == item.insee ) {
            if ( item.c  == 3 )  { 
               fillcolor ='red' ;
              } else if ( item.c  == 4 ) { 
               fillcolor ='green' ;
               }
            else { 
                fillcolor ='orange' ; 
              }

            fillOpacity = 0.6 ;
            isalerte = true ;
        }  

    } );

    if( !isalerte )   {

      var dep =   properties.insee.substring(0, 2) ;
    
      if ( noncouverte[dep] !== undefined ) {
        var l = noncouverte[dep] ;
        var s =  properties.insee.substring(2,5) ;
        
        if (   l.indexOf( s ) != -1  ) {
          fillcolor ='gray' ;
          fillOpacity = 0.4 ;
     
        } 
         
      } 

    }
  
    
    return {
       
              
      //  dashArray: "30 10",                       
        fill: true,
        fillColor: fillcolor ,
        fillOpacity: fillOpacity,
        stroke: true,
        color: "#595959",
        weight: 0.4
                };

  }
////////////////////////////////////////////////////////////////////////////////////////
function styleEau(properties ,zoom) {

    var fillcolor = '#A52A2A' ;
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

  function getVisibleTilesCoords(map)
  {
    
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
    for (var x = nwTilePoint.x; x <= seTilePoint.x; x++) 
    {
       for (var y = nwTilePoint.y; y <= seTilePoint.y; y++) 
       {

          var xTile = Math.abs(x % max);
          var yTile = Math.abs(y % max);
          
          tileCoordsContainer.push({ 'x':xTile, 'y':yTile });
          //console.log('info ' + x + ' ' + y);
          //console.log('tile ' + xTile + ' ' + yTile);
        }
    }
    
    return tileCoordsContainer;
    
  };


}
  

  
  

  
  
  
  
  
  
  
  
 
  
   
   

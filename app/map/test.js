/**
 *
 */
//http://www.programmersought.com/article/4311390269/

/*fetch('/geojson/country')
  .then(res => res.json())
  .then(main);*/
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
  
   L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(map);
  
    const url = '/{z}/{x}/{y}?pbf=true';
    var openmaptilesVectorTileOptions = {
         rendererFactory: L.canvas.tile,
        
       // rendererFactory: L.svg.tile,
       onEachFeature: function(feature, featureLayer, vtLayer, tileCoords) {
      /*  if(vtLayer.name === 'place_label' && feature.properties.localrank > 60) {
            var latlng = this.vtGeometryToLatLng(feature.geometry[0], vtLayer, tileCoords)
            marker = new L.Marker(latlng);
            marker.bindTooltip(feature.properties.name).openTooltip();
            this.addUserLayer(marker, tileCoords);
        }*/
        console.log(  feature) ;
    },

        vectorTileLayerStyles: {
			dep: function(properties ,zoom) { 
                return styleDep(properties ,zoom) 
            },
            
           communes: function(properties ,zoom) {
                return styleCommunes(properties ,zoom)
                            }    
  

		},
    
       interactive: true,
        maxZoom: 14,
        
        getFeatureId: f => { ( f.properties.DEP ) ?  f.properties.DEP  : f.properties.CP } ,
        
    };

    var popup = L.popup();

    var tootltip = L.tooltip();

    var tilesPbfLayer = L.vectorGrid.protobuf(url, openmaptilesVectorTileOptions)
 //  
     .on('click', function(e) {
     //  console.log('denis' ,  e.target._dataLayerNames );
       //console.log('denis' ,  e.layer );
       console.log(  map.getZoom() , e.getFeatureId) ;
       if( map.getZoom() < 9  ) {
        if (e.layer  )
        popup.setContent(e.layer.properties.NAME)
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
        id = e.layer.properties.DEP ;
        console.log( id );
                setTimeout(function() {
                    tilesPbfLayer.setFeatureStyle(id, {
                        fillColor: 'green' ,
                weight: .5,
                    }, 100);
                });

       } else {


        popup.setContent(e.layer.properties.NAME)
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
        id = e.layer.properties.CP ;
                setTimeout(function() {
                    tilesPbfLayer.setFeatureStyle(id, {
                        fillColor: 'orange' ,
                weight: .5,
                    }, 100);
                });



       }

       
				


    }).addTo(map);;
  

 tilesPbfLayer.bindPopup(popup);

  function styleDep(properties ,zoom) {

    var fill = true ;
    var weight = 0.8 ;
    var fillcolor = 'green'
    if( zoom < 9 ) {
        if( properties.DEP == '35' ) {
            fillcolor ='red' ;
        }  
       
    }    

       return {
           // fill: true is needed
           fill: fill,
           fillColor: fillcolor ,
           fillOpacity: 0.1,
           stroke: true,
           color: "#000000",
           weight: weight,
            icon: new L.Icon.Default()
       };
  }
    
  function styleCommunes(properties ,zoom) {

    var fillcolor = '#e0e0d2' ;
    var fillOpacity = 0.5 ;
  //  if( zoom >= 9 ) {
        if( properties.CP == '35230' ) {
            fillcolor ='red' ;
            fillOpacity= 1 ;
        }  
       
 //   }    

    return {
                        
        fill: true,
        fillColor: fillcolor ,
        fillOpacity: fillOpacity,
        stroke: true,
        color: "#595959",
        weight: 0.4
                };

  }



}
  

  
  

  
  
  
  
  
  
  
  
 
  
   
   

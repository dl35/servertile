/**
 *
 */
//http://www.programmersought.com/article/4311390269/

/*fetch('/geojson/country')
  .then(res => res.json())
  .then(main);*/


alertes = {
deps :[ {dep:35 , c:3 } ,  {dep:31 , c:2 } ],
communes :[ {cp:35230 , c:3 } ,{cp:35890 , c:3 },{cp:35131 , c:3 },
{cp:35770 , c:3 },{cp:3500 , c:3 },{cp:35230 , c:3 },{cp:35230 , c:3 },
{cp:31120 , c:2 },{cp:31320 , c:2 },{cp:31600 , c:2 },{cp:31860 , c:2 }
]
};



 

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
  
    const url = '/{z}/{x}/{y}?pbf';
    var openmaptilesVectorTileOptions = {
         rendererFactory: L.canvas.tile,
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
        .on('click', function(e) {
      
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

                setTimeout(function() {
                    tilesPbfLayer.setFeatureStyle(id, {
                        fillColor: 'green' ,
                weight: .5,
                    }, 100);
                });

       } else {

        // var v = (e.layer.properties.CP ) ? e.layer.properties.CP : e.layer.properties.NAME
        var v =  e.layer.properties.NAME ;
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



 //////style departements
  function styleDep(properties ,zoom) {

    var fill = true ;
    var weight = 0.8 ;
    var fillcolor = 'green' ;
    var fillOpacity = 0.3 ;
    if( zoom < 9 ) {

        alertes.deps.forEach((item, value) => {
           
            if( properties.DEP == item.dep ) {
                if ( item.c  == 3 )  fillcolor ='red' ;
                else fillcolor ='orange' ;

                fillOpacity = 1 ;
            }
           
          })


    
       
    }    

       return {
           // fill: true is needed
           fill: fill,
           fillColor: fillcolor ,
           fillOpacity: fillOpacity,
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

    alertes.communes.forEach((item, value) => {

        if( properties.CP == item.cp ) {
            if ( item.c  == 3 )  fillcolor ='red' ;
            else fillcolor ='orange' ;
            fillOpacity = 1 ;
        
        }  

    } );

  

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
  

  
  

  
  
  
  
  
  
  
  
 
  
   
   

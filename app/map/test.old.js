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


var reseaux = [
    //  {r: 20191218093000 , c1:0,c2:1,c_1:2 },
    //  {r: 20191218091500 , c1:0,c2:1,c_1:2 }
   ];
   
   
   function initReseau() {
     var deb = true ;
     var mhtml ="";
     var n1 = 0;
     var n2 = 0;
     var nc = 0; 
     reseaux.forEach((item, value) => {
   
       var chk ="";
       if ( deb ) {
         chk="checked=\"checked\"";
         deb =false;
         nc = item.n_c ;
         n2 = item.n2 ;
         n1 = item.n1;
       }
   
   
   
     mhtml += "<tr><td>";
     mhtml += "<input "+  chk  +" type=\"radio\" name=\"reseau\" value=\""+item.date+"\" onclick=\"switchReseau('"+ item.n2 +"','"+item.n1+"','"+ item.n_c +"');return true;\"></input>";
     mhtml += "<td>"+item.date_str+"</td>";
     if( item.n2 > 0 )
     mhtml += "<td class='n2' width='10' >"+item.n2+"</td>";
     if( item.n1 > 0 )
     mhtml += "<td class='n1' width='10' >"+item.n1+"</td>";
      if( item.n_c > 0 )
     mhtml += "<td class='cn' width='10' >"+item.n_c+"</td>";
     
     mhtml += "</tr>";
     })
   
     $("#treseaux").find('tbody').append( mhtml );
     setLegende(n2,n1,nc);
   
   }
   
   
   alertes ={deps:[],communes:[]} ;
   
   /*
   alertes = {
   deps :[ {id:35 , c:2 } ,  {id:31 , c:1 } ],
   communes :[ {id:35206 , c:2 } ,{id:35266 , c:2 },{id:35066 , c:2 },
   {id:35047 , c:2 },{id:35235 , c:2 },{id:35328 , c:2 },
   {id:31555 , c:1 },{id:31557 , c:1 },
   {id:35288 , c:2 }
   ]
   };*/
   
   var noncouverte = {};
   $.getJSON("noncouverte2.json", function(json) {
       noncouverte = json.list ;
     //  console.log( noncouverte ) ;
   });
   
   // load last data ....
   
   $.getJSON("../get_alertes.php?origin=fr&date=last", function(json) {
     alertes.deps = json.deps ;
     alertes.communes = json.communes ;
     reseaux = json.reseaux ;
     if( json.date_str != undefined ) {
       $("#date_str").html( json.date_str )
     }else {
       $("#date_str").html("")
     }
     
     initReseau();
     main();
   //  console.log( json ) ;
   });
   
   
   function setLegende(n2,n1,nc) {
   
   
     var v = "Aucune commune ne subit des pr\u00e9cipitations tr\u00e8s intenses";
     if (n2 == 1) {
       v = "1 commune subit des pr\u00e9cipitations tr\u00e8s intenses";
     } else if (n2 > 1) {
       v = n2 + " subissent des pr\u00e9cipitations tr\u00e8s intenses";
     }
     
     $("#spn2").text(v);
   
     var v = "Aucune commune ne subit des pr\u00e9cipitations intenses";
     if (n1 == 1) {
       v = "1 commune subit des pr\u00e9cipitations intenses";
     } else if (n1 > 1) {
       v = n1 + " subissent des pr\u00e9cipitations intenses";
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
   
   
   
   function switchReseau(n2,n1,nc) {
     var reseau = $("input:radio[name=reseau]:checked").val();
    
     var url = '../get_alertes.php?origin=fr&date='+reseau ;
     $.getJSON(  url , function(json) {
        alertes.deps = json.deps ;
        alertes.communes = json.communes ;
       if (json.date_str != undefined) {
         $("#date_str").html(json.date_str)
       } else {
         $("#date_str").html("")
       }
       redraw();
   
       setLegende(n2,n1,nc);
     
      
   
   
   
   
      });
   
   }
   
   
   
   var tilesPbfLayer ;
   function redraw() {
     tilesPbfLayer.redraw();
   
   }
   
   
   
    // id = 0;
    // idc = 0 ;
   //  main();
   
   //$extend = "-5.3, 41.1, 10.0, 51.2";
   //$minzoom = 6;
   //$center = "-3.5, 48.2";
   
   
   
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
           minZoom: 6,
           maxZoom: 13,
           getFeatureId: f => { ( f.properties.dep ) ?  f.properties.dep  : f.properties.insee } ,
           
       };
   
       var popup = L.popup({
         className: "custompopup" 
       });
   
   
   
   
   
        tilesPbfLayer = L.vectorGrid.protobuf(url, openmaptilesVectorTileOptions)
           .on('mouseover'  , function(e) {
             if( map.getZoom() >= 10  ) {
               if ( e.layer  )
                   popup.setLatLng(e.latlng) ;
                   popup.setContent(e.layer.properties.nom);
                  popup.openOn(map);
             } else {
               map.closePopup();
        
             }
           }).addTo(map);
       /*    .on('mouseout'  , function(e) {
           })*/
           
        /*   .on('click', function(e) {
         
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
   
          
                   
   
   
       }).addTo(map);;*/
     
   
    tilesPbfLayer.bindPopup(popup);
   
    
   /////////////////////////////////////////////////////////////////////
   // rose = #ff00de;
   // fushia = #8300ff
   /////////////////////////////////////////////////////style departements
     function styleDep(properties ,zoom) {
   
       var fill = false ;
       var weight = 0.8 ;
       var fillcolor = 'white' ;
       var fillOpacity = 0 ;
       if( zoom < 9 ) {
   
           alertes.deps.forEach((item, value) => {
   
               if( properties.dep == item.id ) {
                   if ( item.c  == 2 )  fillcolor ='#ff00de' ;
                   else if ( item.c  == 1 )  fillcolor ='#8300ff' ;
                   
   
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
       
     /////////////////////////////////////////style communes
     function styleCommunes(properties ,zoom) {
   
       var fillcolor = '#e0e0d2' ;
       var fillOpacity = 0.5 ;
   
       var isalerte = false ;
   
     
       alertes.communes.forEach((item, value) => {
   
         //  console.log( item.id );
           var insee = item.id.substring(0, 5) ;
          
           if( properties.insee == insee ) {
             if ( item.c  == 2 )  fillcolor ='#ff00de' ;
             else if ( item.c  == 1 )  fillcolor ='#8300ff' ;
           
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
   
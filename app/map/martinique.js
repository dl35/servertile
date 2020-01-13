

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
   
   
   alertes ={communes:[]} ;
   

   alertes = {
   communes :[ {id:97203 , c:2 } ,{id:9718 , c:2 },{id:97223 , c:2 },
   {id:97210 , c:1 },{id:97202 , c:1 }
   ]
   };
   
   var noncouverte = {};
   $.getJSON("noncouverte2.json", function(json) {
       noncouverte = json.list ;
     //  console.log( noncouverte ) ;
   });
   
 
   
   
 
   main();
   
   
 
   
   
   
   var tilesPbfLayer ;
   function redraw() {
     tilesPbfLayer.redraw();
   
   }
   
   
   
   
     function main() {
   
       const map = L.map('map', {
         center: {
           lat: 14.64,
           lng: -61.05
         },
         zoom: 11,
         minZoom: 11,
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
   
       const url = '/ma/{z}/{x}/{y}?pbf';
     //  const url = '/pbf/{z}/{x}/{y}.pbf';
       
      var openmaptilesVectorTileOptions = {
            rendererFactory: L.canvas.tile,
            vectorTileLayerStyles: {
                communes: function(properties ,zoom) {
                   return styleCommunes(properties ,zoom)
                   } 
            },
           interactive: true,
           minZoom: 10,
           maxZoom: 13,
           getFeatureId: f => { ( f.properties.id ) ?  f.properties.id  : f.properties.insee } ,
           
       };
   
       var popup = L.popup({
        className: 'cpopup' ,
        autoPan :false,
        closeButton:false,
        closeOnClick:true,
        maxWidth:200,
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
      
    
   /////////////////////////////////////////////////////////////////////
   // rose = #ff00de;
   // fushia = #8300ff
   /////////////////////////////////////////////////////style departements
   
   
     /////////////////////////////////////////style communes
     function styleCommunes(properties ,zoom) {
   
       var fillcolor = '#e0e0d2' ;
       var fillOpacity = 0.5 ;
   
       var isalerte = false ;
    
     
       alertes.communes.forEach((item, value) => {


    
        if( properties.id == item.id ) {
            if ( item.c  == 2 )  { 
               fillcolor = '#ff00de' ;
              } else if ( item.c  == 1 ) { 
               fillcolor ='#8300ff' ;
               }

            fillOpacity = 0.6 ;
            isalerte = true ;
        }  

    } );
 
     
       
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
 
   
   }
   
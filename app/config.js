const fs = require('fs');
const geojsonvt = require('geojson-vt');
var config={}



depGeoJson = './geojson/apic/dep.geojson'
const depGeo = JSON.parse(fs.readFileSync( depGeoJson ));

communesGeoJson = './geojson/apic/communes.geojson'
const communesGeo = JSON.parse(fs.readFileSync( communesGeoJson ));

polyCnsJson = './geojson/apic/nonsurveillees.geojson'
const cnsGeo = JSON.parse(fs.readFileSync( polyCnsJson ));

reunionGeoJson = './geojson/apic/reunion.geojson'
const reunionGeo= JSON.parse(fs.readFileSync( reunionGeoJson ));

guadeloupeGeoJson = './geojson/apic/guadeloupe.geojson'
const guadeloupeGeo= JSON.parse(fs.readFileSync( guadeloupeGeoJson ));

martiniqueGeoJson = './geojson/apic/martinique.geojson'
const martiniqueGeo= JSON.parse(fs.readFileSync( martiniqueGeoJson ));

caledonieGeoJson = './geojson/apic/caledonie.geojson'
const caledonieGeo= JSON.parse(fs.readFileSync( caledonieGeoJson ));

tronconsGeoJson = './geojson/apoc/troncons.geojson'
const tronconsGeo= JSON.parse(fs.readFileSync( tronconsGeoJson ));

exutoiresGeoJson = './geojson/apoc/exutoires.geojson'
const exutoiresGeo= JSON.parse(fs.readFileSync( exutoiresGeoJson ));

/*apoc_nonsurveillees = './geojson/apoc/nonsurveillees.geojson'
const apocNonSurveilleesGeo= JSON.parse(fs.readFileSync( apoc_nonsurveillees ));
*/
apoc_union_nonsurveillees = './geojson/apoc/unionnonsurveillees.geojson'
const apocUnionNonSurveilleesGeo= JSON.parse(fs.readFileSync( apoc_union_nonsurveillees ));


// tile index for Vector Tiles
config.depTileIndex = geojsonvt(depGeo, {
//  buffer: 0,
 // debug: 2,
// solidChildren: false,
// extent: 4096,
  maxZoom: 13,  // max zoom to preserve detail on; can't be higher than 24
  tolerance: 3, // s//implification tolerance (higher means simpler)
  extent: 4096, // tile extent (both width and height)
  buffer: 64,   // tile buffer on each side
  debug: 1,     // logging level (0 to disable, 1 or 2)
  lineMetrics: false, // whether to enable line metrics tracking for LineString/MultiLineString features
//  promoteId: 'DEP',    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
//  generateId: true,  // whether to generate feature ids. Cannot be used with `promoteId`
  indexMaxZoom: 0,       // max zoom in the initial tile index
  indexMaxPoints: 1000 // max number of points per tile in the index
});

config.communesTileIndex = geojsonvt(communesGeo, {
//  buffer: 0,
//  debug: 2,
solidChildren: false,
  maxZoom: 13,  // max zoom to preserve detail on; can't be higher than 24
  tolerance: 3, // simplification tolerance (higher means simpler)
  extent: 4096, // tile extent (both width and height)
  buffer: 64,   // tile buffer on each side
  debug: 0,     // logging level (0 to disable, 1 or 2)
  lineMetrics: true,
//  lineMetrics: true, // whether to enable line metrics tracking for LineString/MultiLineString features
//  promoteId: 'CP',    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
 //  generateId: true,  // whether to generate feature ids. Cannot be used with `promoteId`
  indexMaxZoom: 4,       // max zoom in the initial tile index
  indexMaxPoints: 10000 // max number of points per tile in the index



});

config.cnsTileIndex = geojsonvt(cnsGeo, {
  //  buffer: 0,
  //  debug: 2,
  solidChildren: false,
    maxZoom: 13,  // max zoom to preserve detail on; can't be higher than 24
    tolerance: 3, // simplification tolerance (higher means simpler)
    extent: 4096, // tile extent (both width and height)
    buffer: 64,   // tile buffer on each side
    debug: 0,     // logging level (0 to disable, 1 or 2)
    lineMetrics: true,
  //  lineMetrics: true, // whether to enable line metrics tracking for LineString/MultiLineString features
  //  promoteId: 'CP',    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
   //  generateId: true,  // whether to generate feature ids. Cannot be used with `promoteId`
    indexMaxZoom: 4,       // max zoom in the initial tile index
    indexMaxPoints: 10000 // max number of points per tile in the index
  
  
  
  });






  config.tronconsTileIndex = geojsonvt(tronconsGeo, {
  //  buffer: 0,
  //  debug: 2,
  solidChildren: false,
    maxZoom: 13,  // max zoom to preserve detail on; can't be higher than 24
    tolerance: 3, // simplification tolerance (higher means simpler)
    extent: 4096, // tile extent (both width and height)
    buffer: 64,   // tile buffer on each side
    debug: 0,     // logging level (0 to disable, 1 or 2)
    lineMetrics: true,
  //  lineMetrics: true, // whether to enable line metrics tracking for LineString/MultiLineString features
  //  promoteId: 'CP',    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
   //  generateId: true,  // whether to generate feature ids. Cannot be used with `promoteId`
    indexMaxZoom: 4,       // max zoom in the initial tile index
    indexMaxPoints: 10000 // max number of points per tile in the index
  
  
  
  });

  config.exutoiresTileIndex = geojsonvt(exutoiresGeo, {
    //  buffer: 0,
    //  debug: 2,
    solidChildren: false,
      maxZoom: 13,  // max zoom to preserve detail on; can't be higher than 24
      tolerance: 3, // simplification tolerance (higher means simpler)
      extent: 4096, // tile extent (both width and height)
      buffer: 64,   // tile buffer on each side
      debug: 0,     // logging level (0 to disable, 1 or 2)
      lineMetrics: true,
    //  lineMetrics: true, // whether to enable line metrics tracking for LineString/MultiLineString features
    //  promoteId: 'CP',    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
     //  generateId: true,  // whether to generate feature ids. Cannot be used with `promoteId`
      indexMaxZoom: 4,       // max zoom in the initial tile index
      indexMaxPoints: 10000 // max number of points per tile in the index
    
    
    
    });



/*
    config.apocNonSurveilleesTileIndex = geojsonvt(apocNonSurveilleesGeo , {
        //  buffer: 0,
        //  debug: 2,
        solidChildren: false,
          maxZoom: 13,  // max zoom to preserve detail on; can't be higher than 24
          tolerance: 3, // simplification tolerance (higher means simpler)
          extent: 4096, // tile extent (both width and height)
          buffer: 64,   // tile buffer on each side
          debug: 0,     // logging level (0 to disable, 1 or 2)
          lineMetrics: true,
        //  lineMetrics: true, // whether to enable line metrics tracking for LineString/MultiLineString features
        //  promoteId: 'CP',    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
         //  generateId: true,  // whether to generate feature ids. Cannot be used with `promoteId`
          indexMaxZoom: 4,       // max zoom in the initial tile index
          indexMaxPoints: 10000 // max number of points per tile in the index
        
        
        
        });
*/
       
        config.apocUnionNonSurveilleesTileIndex = geojsonvt(apocUnionNonSurveilleesGeo, {
            //  buffer: 0,
            //  debug: 2,
            solidChildren: false,
              maxZoom: 13,  // max zoom to preserve detail on; can't be higher than 24
              tolerance: 3, // simplification tolerance (higher means simpler)
              extent: 4096, // tile extent (both width and height)
              buffer: 64,   // tile buffer on each side
              debug: 0,     // logging level (0 to disable, 1 or 2)
              lineMetrics: true,
            //  lineMetrics: true, // whether to enable line metrics tracking for LineString/MultiLineString features
            //  promoteId: 'CP',    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
             //  generateId: true,  // whether to generate feature ids. Cannot be used with `promoteId`
              indexMaxZoom: 4,       // max zoom in the initial tile index
              indexMaxPoints: 10000 // max number of points per tile in the index
            
            
            
            });









    config.reunionTileIndex = geojsonvt(reunionGeo, {
  //  buffer: 0,
  //  debug: 2,
  solidChildren: false,
    maxZoom: 13,  // max zoom to preserve detail on; can't be higher than 24
    tolerance: 3, // simplification tolerance (higher means simpler)
    extent: 4096, // tile extent (both width and height)
    buffer: 64,   // tile buffer on each side
    debug: 0,     // logging level (0 to disable, 1 or 2)
    lineMetrics: true,
  //  lineMetrics: true, // whether to enable line metrics tracking for LineString/MultiLineString features
  //  promoteId: 'CP',    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
   //  generateId: true,  // whether to generate feature ids. Cannot be used with `promoteId`
    indexMaxZoom: 4,       // max zoom in the initial tile index
    indexMaxPoints: 10000 // max number of points per tile in the index
  
  
  
  });


  config.guadeloupeTileIndex = geojsonvt(guadeloupeGeo, {
    //  buffer: 0,
    //  debug: 2,
    solidChildren: false,
      maxZoom: 13,  // max zoom to preserve detail on; can't be higher than 24
      tolerance: 3, // simplification tolerance (higher means simpler)
      extent: 4096, // tile extent (both width and height)
      buffer: 64,   // tile buffer on each side
      debug: 0,     // logging level (0 to disable, 1 or 2)
      lineMetrics: true,
    //  lineMetrics: true, // whether to enable line metrics tracking for LineString/MultiLineString features
    //  promoteId: 'CP',    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
     //  generateId: true,  // whether to generate feature ids. Cannot be used with `promoteId`
      indexMaxZoom: 4,       // max zoom in the initial tile index
      indexMaxPoints: 10000 // max number of points per tile in the index
    
    
    
    });


    config.martiniqueTileIndex = geojsonvt(martiniqueGeo , {
      //  buffer: 0,
      //  debug: 2,
      solidChildren: false,
        maxZoom: 13,  // max zoom to preserve detail on; can't be higher than 24
        tolerance: 3, // simplification tolerance (higher means simpler)
        extent: 4096, // tile extent (both width and height)
        buffer: 64,   // tile buffer on each side
        debug: 0,     // logging level (0 to disable, 1 or 2)
        lineMetrics: true,
      //  lineMetrics: true, // whether to enable line metrics tracking for LineString/MultiLineString features
      //  promoteId: 'CP',    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
       //  generateId: true,  // whether to generate feature ids. Cannot be used with `promoteId`
        indexMaxZoom: 4,       // max zoom in the initial tile index
        indexMaxPoints: 10000 // max number of points per tile in the index
      
      
      
      });


      config.caledonieTileIndex = geojsonvt(caledonieGeo , {
        //  buffer: 0,
        //  debug: 2,
        solidChildren: false,
          maxZoom: 13,  // max zoom to preserve detail on; can't be higher than 24
          tolerance: 3, // simplification tolerance (higher means simpler)
          extent: 4096, // tile extent (both width and height)
          buffer: 64,   // tile buffer on each side
          debug: 0,     // logging level (0 to disable, 1 or 2)
          lineMetrics: true,
        //  lineMetrics: true, // whether to enable line metrics tracking for LineString/MultiLineString features
        //  promoteId: 'CP',    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
         //  generateId: true,  // whether to generate feature ids. Cannot be used with `promoteId`
          indexMaxZoom: 4,       // max zoom in the initial tile index
          indexMaxPoints: 10000 // max number of points per tile in the index
        
        
        
        });

module.exports = config;
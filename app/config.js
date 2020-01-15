const fs = require('fs');
const geojsonvt = require('geojson-vt');
var config={}



depGeoJson = './geojson/dep.geojson'
const depGeo = JSON.parse(fs.readFileSync( depGeoJson ));

communesGeoJson = './geojson/communes.geojson'
const communesGeo = JSON.parse(fs.readFileSync( communesGeoJson ));

polyCncJson = './geojson/noncouvertesfilter.geojson'
const cncGeo = JSON.parse(fs.readFileSync( polyCncJson ));

reunionGeoJson = './geojson/reunion.geojson'
const reunionGeo= JSON.parse(fs.readFileSync( reunionGeoJson ));

guadeloupeGeoJson = './geojson/guadeloupe.geojson'
const guadeloupeGeo= JSON.parse(fs.readFileSync( guadeloupeGeoJson ));


martiniqueGeoJson = './geojson/martinique.geojson'
const martiniqueGeo= JSON.parse(fs.readFileSync( martiniqueGeoJson ));


caledonieGeoJson = './geojson/caledonie.geojson'
const caledonieGeo= JSON.parse(fs.readFileSync( caledonieGeoJson ));


tronconsGeoJson = './geojson/apoc/troncons.geojson'
const tronconsGeo= JSON.parse(fs.readFileSync( tronconsGeoJson ));

exutoiresGeoJson = './geojson/apoc/exutoires.geojson'
const exutoiresGeo= JSON.parse(fs.readFileSync( exutoiresGeoJson ));

apoc_noncouverte = './geojson/apoc/noncouvertes.geojson'
const apocNonCouverteGeo= JSON.parse(fs.readFileSync( apoc_noncouverte ));

apoc_unionnoncouverte = './geojson/apoc/unionnoncouvertes.geojson'
const apocUnionNonCouverteGeo= JSON.parse(fs.readFileSync( apoc_unionnoncouverte ));


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

config.cncTileIndex = geojsonvt(cncGeo, {
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


    config.apocNonCouverteTileIndex = geojsonvt(apocNonCouverteGeo, {
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


        config.apocUnionNonCouverteTileIndex = geojsonvt(apocUnionNonCouverteGeo, {
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
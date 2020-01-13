/**
 * Example GeoJSON tile server
 */
const fs = require('fs');
const cors = require('cors');
const rbush = require('rbush');
const bbox = require('@turf/bbox');
const vtpbf = require('vt-pbf');
const express = require('express');
const app = express();
const router = express.Router();
const geojsonvt = require('geojson-vt');
const SphericalMercator = require('sphericalmercator');
const featureCollection = require('@turf/helpers').featureCollection;

const views = __dirname + '/map/';


// https://www.wrld3d.com/wrld.js/latest/docs/leaflet/L.GridLayer/

const PORT = 6300;

const mercator = new SphericalMercator({ size: 256 });

depGeoJson = './geojson/dep.geojson'
communesGeoJson = './geojson/communes.geojson'

polyCncJson = './geojson/noncouvertesfilter.geojson'




const depGeo = JSON.parse(fs.readFileSync( depGeoJson ));
const communesGeo = JSON.parse(fs.readFileSync( communesGeoJson ));
const cncGeo = JSON.parse(fs.readFileSync( polyCncJson ));



reunionGeoJson = './geojson/reunion.geojson'
const reunionGeo= JSON.parse(fs.readFileSync( reunionGeoJson ));

guadeloupeGeoJson = './geojson/guadeloupe.geojson'
const guadeloupeGeo= JSON.parse(fs.readFileSync( guadeloupeGeoJson ));


martiniqueGeoJson = './geojson/martinique.geojson'
const martiniqueGeo= JSON.parse(fs.readFileSync( martiniqueGeoJson ));


caledonieGeoJson = './geojson/caledonie.geojson'
const caledonieGeo= JSON.parse(fs.readFileSync( caledonieGeoJson ));

//const coursDeauGeo = JSON.parse(fs.readFileSync('cours_deau.geojson'));

//const dep = JSON.parse(fs.readFileSync('dep.geojson'));


/*
// name the points so that we can id them
for (let i = 0; i < pointGeoj.features.length; i++) {
  let point = pointGeoj.features[i];
  point.properties.name = `${i}`;
}
*/

// tile index for Vector Tiles
const depTileIndex = geojsonvt(depGeo, {
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

const communesTileIndex = geojsonvt(communesGeo, {
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

const cncTileIndex = geojsonvt(cncGeo, {
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
const eauTileIndex = geojsonvt(coursDeauGeo, {
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













/*
const pointTileIndex = geojsonvt(pointGeoj, {
  buffer: 0,
  debug: 2,

  maxZoom: 13,  // max zoom to preserve detail on; can't be higher than 24
  tolerance: 1, // simplification tolerance (higher means simpler)
  extent: 4096 , // tile extent (both width and height)
  buffer: 2,   // tile buffer on each side
  debug: 1,     // logging level (0 to disable, 1 or 2)
  lineMetrics: false, // whether to enable line metrics tracking for LineString/MultiLineString features
//  promoteId: id,    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
  generateId: false,  // whether to generate feature ids. Cannot be used with `promoteId`
  indexMaxZoom: 7,       // max zoom in the initial tile index
  indexMaxPoints: 1000 // max number of points per tile in the index

});
*/



const reunionTileIndex = geojsonvt(reunionGeo, {
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


  const guadeloupeTileIndex = geojsonvt(guadeloupeGeo, {
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


    const martiniqueTileIndex = geojsonvt(martiniqueGeo , {
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


      const caledonieTileIndex = geojsonvt(caledonieGeo , {
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

// returned when empty tiles are requested
const emptyFeatCollection = featureCollection([]);


router.use(function (req,res,next) {
  next();
});

router.get('/', function(req,res) {
  res.sendFile(views + 'index.html');
});


router.get('/:z/:x/:y', (req, res) => {
  if (req.get('If-Modified-Since')) {
    return res.status(304).send();
  }
  const [x, y, z] = [+req.params.x, +req.params.y, +req.params.z];
  //console.log( x , y ,z );

  const dep = depTileIndex.getTile(z, x, y) || emptyFeatCollection;
  var buff = null;

  //console.log("zoom ",  z ) ;

  if (  z > 10 ) {
    const communes = communesTileIndex.getTile(z, x, y) || emptyFeatCollection;
    //const eau = eauTileIndex.getTile(z, x, y) || emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt(  {'dep': dep  , 'communes': communes } );
  } else  if ( z >= 9 ) {
    const communes = communesTileIndex.getTile(z, x, y) || emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt(  {'dep': dep  , 'communes': communes } );
  } else {
 
    const cnc = cncTileIndex.getTile(z, x, y) || emptyFeatCollection;
    // buff = vtpbf.fromGeojsonVt( {'dep': dep  , 'cnc': cnc   });
    buff = vtpbf.fromGeojsonVt( {'dep': dep   });
    
  }

//  const points = pointTileIndex.getTile(z, x, y) || emptyFeatCollection;
  

  res.status(200).send(buff);
});


////////////////////////////////////////////////////////////////////////////////
router.get('/cnc/:z/:x/:y', (req, res) => {
  if (req.get('If-Modified-Since')) {
    return res.status(304).send();
  }
  const [x, y, z] = [+req.params.x, +req.params.y, +req.params.z];
  //console.log( x , y ,z );
 
  var buff = null;

  

  if (  z < 10 ) {
    const cnc = cncTileIndex.getTile(z, x, y) || emptyFeatCollection;
    console.log("cnc ", x , y ,z  ) ;
    buff = vtpbf.fromGeojsonVt( { 'cnc': cnc   });
  } else {
    const cnc = emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt( { 'cnc': cnc   });
  }

//  const points = pointTileIndex.getTile(z, x, y) || emptyFeatCollection;
  

  res.status(200).send(buff);
});


///reunion 
///////////////////////////////////////////////////////////////////


router.get('/re/:z/:x/:y', (req, res) => {
  if (req.get('If-Modified-Since')) {
    return res.status(304).send();
  }
  const [x, y, z] = [+req.params.x, +req.params.y, +req.params.z];
  console.log( x , y ,z );
  
  var buff = null;
  const re = reunionTileIndex.getTile(z, x, y) || emptyFeatCollection;
  buff = vtpbf.fromGeojsonVt( {'communes': re  });
 

//  const points = pointTileIndex.getTile(z, x, y) || emptyFeatCollection;
 

  res.status(200).send(buff);
});

///////////////////////////////////////////////////////////////////

router.get('/ga/:z/:x/:y', (req, res) => {
  if (req.get('If-Modified-Since')) {
    return res.status(304).send();
  }
  const [x, y, z] = [+req.params.x, +req.params.y, +req.params.z];
  console.log( x , y ,z );
  
  var buff = null;
  const ga = guadeloupeTileIndex.getTile(z, x, y) || emptyFeatCollection;
  buff = vtpbf.fromGeojsonVt( {'communes': ga  });
 

//  const points = pointTileIndex.getTile(z, x, y) || emptyFeatCollection;
 

  res.status(200).send(buff);
});
////////////////////////////////////////////////////////////////////
router.get('/ma/:z/:x/:y', (req, res) => {
  if (req.get('If-Modified-Since')) {
    return res.status(304).send();
  }
  const [x, y, z] = [+req.params.x, +req.params.y, +req.params.z];
  console.log( x , y ,z );
  
  var buff = null;
  const ga = martiniqueTileIndex.getTile(z, x, y) || emptyFeatCollection;
  buff = vtpbf.fromGeojsonVt( {'communes': ga  });
 

//  const points = pointTileIndex.getTile(z, x, y) || emptyFeatCollection;
 

  res.status(200).send(buff);
});

///////////////////////////////////////////////////////////////////////
router.get('/ca/:z/:x/:y', (req, res) => {
  if (req.get('If-Modified-Since')) {
    return res.status(304).send();
  }
  const [x, y, z] = [+req.params.x, +req.params.y, +req.params.z];
  console.log( x , y ,z );
  
  var buff = null;
  const ga = caledonieTileIndex.getTile(z, x, y) || emptyFeatCollection;
  buff = vtpbf.fromGeojsonVt( {'communes': ga  });
 

//  const points = pointTileIndex.getTile(z, x, y) || emptyFeatCollection;
 

  res.status(200).send(buff);
});



///////////////////////////////////////////////////////////////////////
router.get('/store/:z/:x/:y', (req, res) => {
  const [x, y, z] = [+req.params.x, +req.params.y, +req.params.z];
  const dep = depTileIndex.getTile(z, x, y) || emptyFeatCollection;
  var buff = null;
  if ( z >= 9 ) {
    const communes = communesTileIndex.getTile(z, x, y) || emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt(  {'dep': dep  , 'communes': communes   } );
  } else {
    const cnc = cncTileIndex.getTile(z, x, y) || emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt( {'dep': dep  , 'cnc': cnc   });
    
  }

//  const points = pointTileIndex.getTile(z, x, y) || emptyFeatCollection;
  var path = __dirname + '/tiles/' + z + '/' + x ;
  
  fs.existsSync( path ) ||   fs.mkdirSync(path , { recursive: true } ) ;
  var file = path +'/'+ y +'.pbf';
  try {
   console.log( '...create file '+ x+'/'+y+'/'+z  ) ;
  fs.writeFileSync( file , buff) ;
  res.status(200).send('ok');
} catch(err) { 
  console.error(err);
}
});


/*
router.get('/pbf/:z/:x/:y', (req, res) => {
  const { type } = req.params;
  if (type === 'country') {
    res.json(countryGeoj);
  } else if (type === 'point') {
    res.json(pointGeoj);
  } else {
    res.status(404).send({ nah: 'b' });
  }
});
*/

/*
router.get('/geojson/:type', (req, res) => {
  const { type } = req.params;
  if (type === 'country') {
    res.json(countryGeoj);
  } else if (type === 'point') {
    res.json(pointGeoj);
  } else {
    res.status(404).send({ nah: 'b' });
  }
});
*/

app.use(express.static(views));
app.use('/tiles', express.static(__dirname + '/tiles'));
app.use('/', router);


app.listen(PORT, () => {
  console.log(`app listening on port :${PORT}`);
});


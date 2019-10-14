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

// load features from file
const countryGeoj = JSON.parse(fs.readFileSync('countries.geojson'));
const pointGeoj = JSON.parse(fs.readFileSync('points-10000.geojson'));

const depGeo = JSON.parse(fs.readFileSync('departements.geojson'));
const communesGeo = JSON.parse(fs.readFileSync('communes.geojson'));
//const dep = JSON.parse(fs.readFileSync('dep.geojson'));



// name the points so that we can id them
for (let i = 0; i < pointGeoj.features.length; i++) {
  let point = pointGeoj.features[i];
  point.properties.name = `${i}`;
}

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
  const dep = depTileIndex.getTile(z, x, y) || emptyFeatCollection;
  var buff = null;
  if ( z >= 9 ) {
    const communes = communesTileIndex.getTile(z, x, y) || emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt(  {'dep': dep  , 'communes': communes   } );
  } else {
 
    buff = vtpbf.fromGeojsonVt( {'dep': dep  });
  }

//  const points = pointTileIndex.getTile(z, x, y) || emptyFeatCollection;
 
  res.status(200).send(buff);
});

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

app.use(express.static(views));
app.use('/', router);


app.listen(PORT, () => {
  console.log(`app listening on port :${PORT}`);
});


/**
 * Example GeoJSON tile server
 */
const fs = require('fs');
//const cors = require('cors');
//const rbush = require('rbush');
//const bbox = require('@turf/bbox');
const vtpbf = require('vt-pbf');
const express = require('express');
const app = express();
const router = express.Router();
//const geojsonvt = require('geojson-vt');
const SphericalMercator = require('sphericalmercator');
const featureCollection = require('@turf/helpers').featureCollection;

var config = require('./config.js');


const views = __dirname + '/map/';


// https://www.wrld3d.com/wrld.js/latest/docs/leaflet/L.GridLayer/

const PORT = 6300;

const mercator = new SphericalMercator({ size: 256 });



// returned when empty tiles are requested
const emptyFeatCollection = featureCollection([]);


router.use(function (req,res,next) {
  next();
});

router.get('/', function(req,res) {
  res.sendFile(views + 'index.html');
});


///////////////////////////////////////////////////////////////////


router.get('/apic/:origin/:z/:x/:y', (req, res) => {
  if (req.get('If-Modified-Since')) {
    return res.status(304).send();
  }
  const origin = req.params.origin;
  const [x, y, z] = [+req.params.x, +req.params.y, +req.params.z];
  
  var buff = null;

  console.log( origin , ' => ', x , y ,z  ) ;

  if( origin == 'ga' ) {
    om = config.guadeloupeTileIndex.getTile(z, x, y) || emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt( {'communes': om  });
  } else if ( origin =='ma' ) {
    om = config.martiniqueTileIndex.getTile(z, x, y) || emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt( {'communes': om  });
  } else if ( origin =='re' ) {
    om = config.reunionTileIndex.getTile(z, x, y) || emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt( {'communes': om  });
  } else if ( origin =='nc' ) {
    om = config.caledonieTileIndex.getTile(z, x, y) || emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt( {'communes': om  });
  } else if ( origin =='cns'  ) {
    //communes non couverte
    if (  z < 10 ) {
      const cns = config.cnsTileIndex.getTile(z, x, y) || emptyFeatCollection;
      buff = vtpbf.fromGeojsonVt( { 'cns': cns   });
    } else {
      const cns = emptyFeatCollection;
      buff = vtpbf.fromGeojsonVt( { 'cns': cns   });
    }
  } else if ( origin =='fr' ) {
    const dep = config.depTileIndex.getTile(z, x, y) || emptyFeatCollection;
   
    if ( z >= 9 ) {
      const communes = config.communesTileIndex.getTile(z, x, y) || emptyFeatCollection;
      buff = vtpbf.fromGeojsonVt(  {'dep': dep  , 'communes': communes } );
    }  else {
      buff = vtpbf.fromGeojsonVt( {'dep': dep  });
       }
  }


  res.header("Access-Control-Allow-Origin", "*");
  res.status(200).send(buff);
});




////////////////////////////////////////////////////////////////////////////////////////


router.get('/apoc/:origin/:z/:x/:y', (req, res) => {
  if (req.get('If-Modified-Since')) {
    return res.status(304).send();
  }
  const origin = req.params.origin;
  const [x, y, z] = [+req.params.x, +req.params.y, +req.params.z];
  
  var buff = null;

  
  // gestion de la couverture
<<<<<<< HEAD
  if ( origin =='cns' ) {
   // const communes_nc = config.apocNonSurveilleesTileIndex.getTile(z, x, y) || emptyFeatCollection;
    const communes_union_nc = config.apocUnionNonSurveilleesTileIndex.getTile(z, x, y) || emptyFeatCollection;

    console.log( 'zoom: ' , z)
    buff = vtpbf.fromGeojsonVt( {'cns': communes_union_nc  });
   /* if ( z >= 9 ) {
      buff = vtpbf.fromGeojsonVt(  {'cns': communes_union_nc } );
=======
  if ( origin =='couvfr' ) {
    const communes_nc = config.apocNonCouverteTileIndex.getTile(z, x, y) || emptyFeatCollection;
    const communes_union_nc = config.apocUnionNonCouverteTileIndex.getTile(z, x, y) || emptyFeatCollection;

    console.log( 'zoom: ' , z)

    if ( z >= 9 ) {
      buff = vtpbf.fromGeojsonVt(  {'cnc': communes_nc } );
>>>>>>> 709bbcc5c6b5eb09809f2351388d0b124654eebf
    }  else {
      buff = vtpbf.fromGeojsonVt( {'cns': communes_union_nc  });
       }*/
  }
  else if ( origin =='fr' ) {
    const troncons = config.tronconsTileIndex.getTile(z, x, y) || emptyFeatCollection;
    const exutoires = config.exutoiresTileIndex.getTile(z, x, y) || emptyFeatCollection;
    
    if ( z >= 10 ) {
      buff = vtpbf.fromGeojsonVt(  {'tr' : troncons , 'exu' : exutoires} );
    }
    else if ( z == 9 ) {
    buff = vtpbf.fromGeojsonVt(  { 'tr' : troncons } );
    } 

  }


  res.header("Access-Control-Allow-Origin", "*");
  res.status(200).send(buff);
});

////////////////////////////////////////////////////////////////////////////////////////////////////


router.get('/store/apoc/:origin/:z/:x/:y', (req, res) => {
  if (req.get('If-Modified-Since')) {
    return res.status(304).send();
  }
  const origin = req.params.origin;
  const [x, y, z] = [+req.params.x, +req.params.y, +req.params.z];
  
  var buff = null;

  
  // gestion de la couverture
<<<<<<< HEAD
  if ( origin =='cns' ) {
    //const communes_nc = config.apocNonSurveilleesTileIndex.getTile(z, x, y) || emptyFeatCollection;
    const communes_union_nc = config.apocUnionNonSurveilleesTileIndex.getTile(z, x, y) || emptyFeatCollection;

    console.log( 'zoom: ' , z)
    buff = vtpbf.fromGeojsonVt(  {'cns': communes_union_nc } );
    /*if ( z >= 9 ) {
      buff = vtpbf.fromGeojsonVt(  {'cns': communes_union_nc } );
    }  else {
      buff = vtpbf.fromGeojsonVt( {'cns': communes_union_nc  });
       }*/
  }
  else if ( origin == 'fr' ) {
    //const dep = config.depTileIndex.getTile(z, x, y) || emptyFeatCollection;
    const troncons = config.tronconsTileIndex.getTile(z, x, y) || emptyFeatCollection;
    const exutoires = config.exutoiresTileIndex.getTile(z, x, y) || emptyFeatCollection;
    //const communes = config.communesTileIndex.getTile(z, x, y) || emptyFeatCollection;
    if ( z >= 10 ) {
      buff = vtpbf.fromGeojsonVt(  {'tr' : troncons , 'exu' : exutoires} );
    }
    else if ( z == 9 ) {
    buff = vtpbf.fromGeojsonVt(  { 'tr' : troncons } );
    } 

    
=======
  if ( origin =='couvfr' ) {
    const communes_nc = config.apocNonCouverteTileIndex.getTile(z, x, y) || emptyFeatCollection;
    const communes_union_nc = config.apocUnionNonCouverteTileIndex.getTile(z, x, y) || emptyFeatCollection;

    console.log( 'zoom: ' , z)

    if ( z >= 9 ) {
      buff = vtpbf.fromGeojsonVt(  {'cnc': communes_nc } );
    }  else {
      buff = vtpbf.fromGeojsonVt( {'cnc': communes_union_nc  });
       }
  }
  else if ( origin =='fr' ) {
    const dep = config.depTileIndex.getTile(z, x, y) || emptyFeatCollection;
    const troncons = config.tronconsTileIndex.getTile(z, x, y) || emptyFeatCollection;
    const exutoires = config.exutoiresTileIndex.getTile(z, x, y) || emptyFeatCollection;
    const communes = config.communesTileIndex.getTile(z, x, y) || emptyFeatCollection;
    
    if ( z >= 10 ) {
      buff = vtpbf.fromGeojsonVt(  {'communes': communes , 'tr' : troncons , 'exu' : exutoires} );
    }
    else if ( z == 9 ) {
    const communes = config.communesTileIndex.getTile(z, x, y) || emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt(  {'communes': communes , 'tr' : troncons } );
    } else {
    buff = vtpbf.fromGeojsonVt( {'dep': dep  });
       }
>>>>>>> 709bbcc5c6b5eb09809f2351388d0b124654eebf
  }

  
  var path = __dirname + '/tiles/apoc/pbf/'+origin+'/' + z + '/' + x ;
  
  fs.existsSync( path ) ||   fs.mkdirSync(path , { recursive: true } ) ;
  var file = path +'/'+ y +'.pbf';
  try {
   console.log( origin +'...create file '+ z+'/'+x+'/'+y  ) ;
  fs.writeFileSync( file , buff) ;
  res.status(200).send('ok');
} catch(err) { 
  console.error(err);
}
  
});


////////////////////////////////////////////////////////////////////////////////////////
router.get('/store/:origin/:z/:x/:y', (req, res) => {
  const origin = req.params.origin
  const [x, y, z] = [+req.params.x, +req.params.y, +req.params.z];
  
  var buff = null;
  var om = null ;
  if( origin == 'ga' ) {
    om = config.guadeloupeTileIndex.getTile(z, x, y) || emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt( {'communes': om  });
  } else if ( origin =='ma' ) {
    om = config.martiniqueTileIndex.getTile(z, x, y) || emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt( {'communes': om  });
  } else if ( origin =='re' ) {
    om = config.reunionTileIndex.getTile(z, x, y) || emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt( {'communes': om  });
  } else if ( origin =='nc' ) {
    om = config.caledonieTileIndex.getTile(z, x, y) || emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt( {'communes': om  });
  } else if ( origin =='cns' ) {
    //communes non surveillé
    if (  z < 10 ) {
      const cns = config.cnsTileIndex.getTile(z, x, y) || emptyFeatCollection;
      if ( cns.features.length == 0 ) 
          console.log( 'empty feature' )
      buff = vtpbf.fromGeojsonVt( { 'cns': cns   });
    } else {
      const cns = emptyFeatCollection;
      buff = vtpbf.fromGeojsonVt( { 'cns': cns   });
    }

  } else if ( origin =='fr' ) {
    const dep = config.depTileIndex.getTile(z, x, y) || emptyFeatCollection;
    if ( z >= 9 ) {
    const communes = config.communesTileIndex.getTile(z, x, y) || emptyFeatCollection;
    buff = vtpbf.fromGeojsonVt(  {'dep': dep  , 'communes': communes   } );
    } else {
    buff = vtpbf.fromGeojsonVt( {'dep': dep });
    }
    
  } 

  
  var path = __dirname + '/tiles/apic/pbf/'+origin+'/' + z + '/' + x ;
  
  fs.existsSync( path ) ||   fs.mkdirSync(path , { recursive: true } ) ;
  var file = path +'/'+ y +'.pbf';
  try {
   console.log( origin +'...create file '+ z+'/'+x+'/'+y  ) ;
  fs.writeFileSync( file , buff) ;
  res.status(200).send('ok');
} catch(err) { 
  console.error(err);
}
});

router.get('/static/*', (req, res) => {
 var u = "http://oprodf1.smiro.meteo.fr" + req.path ;
 console.log( u );
res.redirect( u );

<<<<<<< HEAD

});




router.get('/statcns/:n', (req, res) => {

  const n = req.params.n
  console.log( n );

  var file = __dirname +'/couverture/'+n  ;

  res.header("Content-Type",'application/json');
  res.header("Access-Control-Allow-Origin", "*");
  res.sendFile( file );
 
 });
 
=======
>>>>>>> 709bbcc5c6b5eb09809f2351388d0b124654eebf

});


app.use(express.static(views));

//app.use('/tiles', express.static(__dirname + '/tiles'));
app.use('/', router);


app.listen(PORT, () => {
  console.log(`app listening on port :${PORT}`);
});


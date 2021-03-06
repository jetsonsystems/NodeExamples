'use strict';
var 
  imageService = require('./lib/plm-image/ImageService')
  ,_ = require('underscore')
  ,util = require('util')
  ,async = require('async')
  ,fs = require('fs')
;

var root_dir = './test/resources';

imageService.config.db.name = 'plm_staging';

console.log("starting...");

var asset = ['eastwood','obama','clooney','jayz'];


/*
imageService.parseImage(
  root_dir + "/2011-10-31_10-11-54.jpg",
  function(err, imgData, imgStream) {
    // if (err) { console.log(err); throw err; }
    if (err) { console.log(err); }
    console.log("imgData: " + JSON.stringify(imgData,null,'  '));
  }
);
*/

/*
imageService.parseAndTransform(
  root_dir + "/eastwood.png",
  { saveOriginal: true 
    ,desiredVariants: [ 
      { name: 'eastwood_thumb.jpg', format: "JPG", width: 120, height: 150} 
    ]
  },
  function(err, result) {
    if (err) { console.log(err); }

    var i = 0;

    function iterator(element, next) {
      console.log("inspect: " + util.inspect(result));
      var name = 'out-'+i+'.'+element.data.format.toLowerCase();
      var file = fs.createWriteStream(name);
      console.log("outputting file: %j",name);
      fs.createReadStream(element.stream).pipe(file);
      // element.stream.pipe(file);
      i++
      next();
    }

    async.forEachSeries(result, iterator, function(err) { console.log('done');});
  }
);
*/

// for operations that use couch, try them inside the callback to checkConfig
imageService.checkConfig( function(err, result) {

if (err) {
  console.log(err); 
  return;
} else {
  console.log("db is ok: %j", JSON.stringify(result));

// simple save
/*
imageService.save(
  root_dir + "//eastwood.png",
  function(err, result) {
    // if (err) { console.log(err); throw err; }
    if (err) { console.log(err); }
    // console.log("result: " + JSON.stringify(result));
    console.log("inspect: " + util.inspect(result));
  }
);
*/

// save with variants
/*
imageService.save(
  root_dir + "/eastwood.png",
  function(err, result) {
    // if (err) { console.log(err); throw err; }
    if (err) { console.log(err); }
    // console.log("result: " + JSON.stringify(result));
    console.log("inspect: " + util.inspect(result));
  },
  { saveOriginal: true 
    ,desiredVariants: [ 
      { name: 'eastwood_thumb.jpg', format: "JPG", width: 120, height: 150} 
      ,{ name: 'eastwood_screen.jpg', format: "JPG", width: 360, height: 450} 
    ]
  }
);
*/

// save all inside the array asset
/*
_.each(asset, 
  function(name) {
    var img_path = root_dir + '/' + name + '.png';
    console.log("saving %j", img_path);
    
    imageService.save(
      img_path,
      function(err, result) {
        if (err) { console.log(err); }
        console.log("result: " + JSON.stringify(result));
      }
    );
    
  });
*/


/*
imageService.findVersion(root_dir + '/eastwood.png', function (version) {
  console.log("img version: %j", version);
});
*/


// save with variants
/*
imageService.save(
  root_dir + "/eastwood.png",
  function(err, result) {
    // if (err) { console.log(err); throw err; }
    if (err) { console.log(err); }
    // console.log("result: " + JSON.stringify(result));
    console.log("inspect: " + util.inspect(result));
  },
  null,
  { saveOriginal: true 
    ,desiredVariants: [ 
      { name: 'eastwood_thumb.jpg', format: "JPG", width: 120, height: 150} 
    ]
  }
);
*/


// show by oid
/*
var oid = 'a060bfea-0845-437e-97bf-989d55d189cb';
imageService.show(oid, function(err, image) {
  if (err) { console.log("error: " + err); return; };
  //console.log('retrieved image with oid %j: ' +  JSON.stringify(image,null,'  '), oid);
  console.log('retrieved image with oid %j: ' +  util.inspect(image, true, null));
});
*/


// return all by default
/*
imageService.index(
  function(err, aryImage) {
    if (err) { console.log(err); return; }

    // console.log("result: "  + util.inspect(aryImage));

    _.each(aryImage, function(image) {
      console.log('retrieved image with oid %j: %j - created_at: %j ', image.oid, image.path, image.created_at);
    });

  }
);
*/


// find by date range
imageService.index(
  function(err, aryImage) {
    if (err) { console.log(err); return; }

    // console.log("result: "  + util.inspect(aryImage));

    _.each(aryImage, function(image) {
      console.log('retrieved image with oid %j: %j - created_at: %j ', image.oid, image.path, image.created_at);
    });

  },
  { created: ["20121101", "20121201"] }
);

  }
}); // the initial checkConfig call

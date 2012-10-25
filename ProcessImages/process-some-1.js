var _ = require('underscore');
var dive = require('dive');
var fs = require('fs');
var path = require('path');
var util = require('util');
var mime = require('mime-magic');
var im = require('imagemagick');
var Step = require('step');

var importDir = './PLM/Media/Import/Images/';
var workDir = './PLM/Media/.work/Images/';
var derivedDir = './PLM/Media/.derived/Images/';

var files = [];

var processImages = function(images) {
  var processImage = function(iData) {
    var filename = iData.filename;
    console.log('process-some: Processing image - ' + filename);
    var sizes = [{width: 80, height: 80}, 
                 {width: 640, height: 400}, 
                 {width: 1280, height: 800}];
    var doResize = function(geometry, onResize) {
      var basename = _.last(filename.split('/'));
      var re = /\.[^\.]+$/;
      basename = basename.replace(re, '');
      var workPath = path.join(workDir, basename) + '-' + geometry.width + 'x' + geometry.height + '.jpg';
      console.log('process-some: ' + filename + ' -> ' + workPath);
      var options = {srcPath: filename,
                     dstPath: workPath,
                     width: geometry.width,
                     height: geometry.height};
      im.resize(options,
                function(err) {
                  console.log('process-some: processed - ' + filename + ', width - ' + geometry.width + ', height - ' + geometry.height);
                  if (err) {
                    fs.unlinkSync(options.dstPath);
                  }
                  else {
                    var derivedPath = path.join(derivedDir, basename) + '-' + geometry.width + 'x' + geometry.height + '.jpg';                    
                    fs.renameSync(options.dstPath, derivedPath);
                  }
                  onResize(err, 
                           {status: err,
                            resizeOptions: options});
                });
    }
    Step(
      function doAll() {
        var that = this;
        _.each(sizes,
               function(size) {
                 doResize(size, that.parallel());
               });
      },
      function finalize(err) {
        _.rest(arguments,
               function(result) {
                 console.log(result);
                 if (result.status) {
                   console.log('process-some: error processing - ' + result.resizeOptions.srcPath);
                 }
                 else {
                   console.log('process-some: successfully processed - ' + result.resizeOptions.srcPath);
                 }
               });
        var image = images.shift();
        if (image) {
          processImage(image);
        }
      }
    );
  }
  var image = images.shift();
  if (image) {
    processImage(image);
  }
};

dive(importDir, 
     {}, 
     function(err, file) {
       if (err) throw err;
       var stats = fs.statSync(file);
       if (stats.isFile()) {
         files.push({ filename: file,
                      stats: stats
                    });
       }
       else {
         console.log('read-some: file ' + file + ' is not a file!');
       }
     },
     function() {
       mime(_.pluck(files, 'filename'), function(err, types) {
         if (err) {
           console.log('read-some: Error getting file types.');
         }
         else {
           var i = 0;
           _.map(files, function(fData) {
             fData.fileType = types[i];
             console.log('read-some: file - ' + fData.filename);
             console.log('read-some:      - file type = ' + fData.fileType);
             console.log('read-some:      - ' + util.format('%j', fData.stats));
             i = i + 1;
           });
           console.log('read-some: Have ' + files.length + ' files.');
           var re = /^image\//;
           processImages(_.filter(files, function(fData){ return fData.fileType.match(re); }));
         }

       })
     });


console.log('process-some: done');

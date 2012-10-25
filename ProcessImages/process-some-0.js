//
// Do a chain of callbacks which initiate many im.convert calls. This blows up as at some point
// we cannot do that many in parrallel.
//
var _ = require('underscore');
var dive = require('dive');
var fs = require('fs');
var path = require('path');
var util = require('util');
var mime = require('mime-magic');
var im = require('imagemagick');

var importDir = './PLM/Media/Import/Images/';
var workDir = './PLM/Media/.work/Images/';
var derivedDir = './PLM/Media/.derived/Images/';

var files = [];

var processImages = function(images) {
  _.each(images, 
         function(iData) {
           console.log('process-some: Processing image - ' + iData.filename);
           _.each([{width: 80, height: 80}, 
                   {width: 640, height: 400}, 
                   {width: 1280, height: 800}],
                  function(geometry) {
                    var basename = _.last(iData.filename.split('/'));
                    var re = /\.[^\.]+$/;
                    basename = basename.replace(re, '');
                    var workPath = path.join(workDir, basename) + '-' + geometry.width + 'x' + geometry.height + '.jpg';
                    console.log('process-some: ' + iData.filename + ' -> ' + workPath);
                    im.convert([ iData.filename, '-resize', "".concat(geometry.width, 'x', geometry.height), workPath ],
                               function(err, stdout) {
                                 if (err) {
                                   console.log('process-some: error resizing - ' + iData.filename);
                                 }
                                 else {
                                   console.log('process-some: converted - ' + iData.filename);
                                   im.readMetadata(workPath, function(err, metadata) {
                                     if (err) {
                                       console.log('process-some: read meta data error for - ' + workPath);
                                     }
                                     else {
                                       console.log('process-some: ' + util.format("%j", metadata));
                                     }
                                   });
                                 }
                               });
                  });
         });
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

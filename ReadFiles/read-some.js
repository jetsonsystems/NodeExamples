var _ = require('underscore');
var dive = require('dive');
var fs = require('fs');
var util = require('util');
var mime = require('mime-magic');

var importDir = './PLM/Media/Import/Images/';

var files = [];

dive(importDir, {}, 
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
             console.log('read-some: file - ' + fData.filename);
             console.log('read-some:      - file type = ' + types[i]);
             console.log('read-some:      - ' + util.format('%j', fData.stats));
             i = i + 1;
           });
         }
         console.log('read-some: Have ' + files.length + ' files.');
       })
     });

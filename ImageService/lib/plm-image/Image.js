'use strict';
var _ = require('underscore');
require('mootools');
var Persistent = require('../plm-persistent');

// Image represents basic information on an image
// ----------------------------------------------
// exports.Image = new Class(
module.exports = new Class(
{
  Extends: Persistent,

  initialize : function(args)
  {
    this.parent(args);
    this.class_name = 'plm.Image'; 

    this.path     = '';
    this.format   = '';
    this.geometry = '';
    this.size     = '';
    this.type     = '';
    this.depth    = '';
    this.filesize = '';
    this.checksum = '';
    this.metadata_raw = {};

    
    if (_.isObject(args)) {
      this.path     = args.path;
      this.format   = args.format;
      this.geometry = args.geometry;
      this.size     = args.size;
      this.type     = args.type;
      this.depth    = args.depth;
      this.filesize = args.filesize;
      this.checksum = args.checksum;
      this.metadata_raw = args.metadata_raw;
    }
  },

  // populate this Image object based on the output of GraphicsMagick.identify()
  readFromGraphicsMagick : function(obj)
  {
    if (_.isObject(obj)) {
      this.format   = obj.format;
      this.geometry = obj.Geometry;
      this.size     = obj.size;
      this.type     = obj.Type;
      this.depth    = obj.depth;
      this.filesize = obj.Filesize;
      this.metadata_raw = obj;
    }
  }

}); 

// var img = new Image();
// console.log('img: ' + JSON.stringify(img));

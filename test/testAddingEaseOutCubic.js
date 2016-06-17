var aeTemporalToCubicEase = require('./..');
var fullExport = require('./full-export');

module.exports = function(t) {
  var hasEase = false;
  var out = aeTemporalToCubicEase(fullExport);

  out.project.items.forEach(function(item) {
    var layers = item.layers;

    if(layers) {
      layers.forEach(function(layer) {
        Object.keys(layer.properties).forEach(function(keyProperty) {
          var property = layer.properties[ keyProperty ];

          loopThroughProperty(t, property);
        });
      });
    }
  });

  t.ok(hasEase, 'did encounter ease info');

  t.end();

  function loopThroughProperty(t, property) {
    if(property.keyframes) {
      property.keyframes.forEach(function(keyframe) {
        checkKeyFrame(t, keyframe);
      });
    }

    if(property.propertyType === 'NAMED_GROUP') {
      Object.keys(property).forEach(function(keyProperty) {
        loopThroughProperty(t, property[ keyProperty ]);
      });
    }
  }

  function checkKeyFrame(t, keyframe) {
    if(keyframe[ 2 ]) {
      if(keyframe[ 2 ]) {
        t.ok(keyframe[ 2 ].easeOutCubic, 'keyframe had easeOutCubic');
        hasEase = true;
      }
    }
  }
};
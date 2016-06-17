var getKeyFrames = require('../lib/getKeyFrames');
var property = require('./property');

module.exports = function(t) {
  var keyframes = getKeyFrames(property);

  keyframes.forEach(function(keyframe, i) {
    var ease = keyframe[ 2 ];

    t.ok(ease.easeOutCubic, 'ease out cubic exists');
    t.ok(ease.easeOutCubic.temporalEase, 'temporalEase exists');

    if(i === keyframes.length - 1) {
      t.equal(ease.easeOutCubic.temporalEase[ 0 ], 'hold', 'last keyframe is a hold keyframe');
    } else {
      t.equal(ease.easeOutCubic.temporalEase.length, 4, 'four values exported');
      t.equal(ease.easeOutCubic.temporalEase.filter(function(value) {
        return typeof value === 'number';
      }).length, 4, 'every value was a number');
    }
  });

  t.end();
};
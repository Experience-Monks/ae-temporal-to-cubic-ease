var xtend = require('xtend');

var getCurveLength = require('./getCurveLength');
var getArrayValue = require('./getArrayValue');
var resolveToNonArrayIfPossible = require('./resolveToNonArrayIfPossible');

module.exports = getKeyFrames;

function getKeyFrames(property) {
  var keyframes = property.keyframes;

  return keyframes.map(function(keyframe, i) {
    var out = keyframe.map(function(part) {

      if(Array.isArray(part)) {
        return part.slice();
      } else if(typeof part === 'object') {
        return xtend({}, part);
      } else {
        return part;
      }
    });

    var nextFrame = keyframes[ i + 1 ];
    var timeCurrent = keyframe[ 0 ];
    var valueCurrent = keyframe[ 1 ];
    var easeCurrent = keyframe[ 2 ];
    var averageSpeed = 0;
    var bezierOut = {};
    var bezierIn = {};
    var isEaseLinear;
    var influenceIn;
    var influenceOut;
    var timeNext;
    var valueNext;
    var easeNext;
    var durationCurrentToNext;
    var curveLength;

    // this isn't the last keyframe or the current keyframe is not a hold
    if(nextFrame && easeCurrent.easeOut.type !== 'hold') {

      timeNext = nextFrame[ 0 ];
      valueNext = nextFrame[ 1 ];
      easeNext = nextFrame[ 2 ];
      durationCurrentToNext = timeNext - timeCurrent;

      isEaseLinear = easeNext && (easeCurrent.easeOut.type === 'linear' && easeCurrent.easeOut.type === easeNext.easeIn.type);

      // we have an ease and theres a spatialTangent defined
      // some properties don't have spatial tangents (most props)
      switch(property.propertyValueType) {
        case 'ThreeD_SPATIAL':
        case 'TwoD_SPATIAL':
          curveLength = getCurveLength(
            valueCurrent, 
            valueNext,
            easeCurrent.easeOut.spatialTangent, 
            easeNext.easeIn.spatialTangent
          );

          if(curveLength === 0) {
            influenceOut = easeCurrent.easeOut;
            influenceIn = easeNext.easeIn;
          } else {
            influenceOut = Math.min(100 * curveLength / (easeCurrent.easeOut.temporalEase[ 0 ].speed * durationCurrentToNext), easeCurrent.easeOut.temporalEase[ 0 ].influence);
            influenceIn = Math.min(100 * curveLength / (easeCurrent.easeIn.temporalEase[ 0 ].speed * durationCurrentToNext), easeCurrent.easeIn.temporalEase[ 0 ].influence);
          }

          averageSpeed = curveLength / durationCurrentToNext;

          bezierOut.x = influenceOut / 100;
          bezierIn.x = 1 - influenceIn / 100;
        break;

        case 'SHAPE':
          averageSpeed = 1;
          influenceIn = Math.min(100 / easeCurrent.easeIn.temporalEase[ 0 ].speed, easeCurrent.easeIn.temporalEase[ 0 ].influence);
          influenceOut = Math.min(100 / easeCurrent.easeOut.temporalEase[ 0 ].speed, easeCurrent.easeOut.temporalEase[ 0 ].influence);

          bezierOut.x = infOut / 100;
          bezierIn.x = 1 - infIn / 100;
        break;

        case 'ThreeD':
        case 'TwoD':
        case 'OneD':
        case 'COLOR':
          bezierOut.x = [];
          bezierIn.x = [];
          averageSpeed = [];

          // calculate bezier
          easeNext.easeIn.temporalEase.forEach(function(easeIn, i) {
            var easeOut = easeCurrent.easeOut.temporalEase[ i ];

            bezierOut.x[ i ] = easeOut.influence / 100;
            bezierIn.x[ i ] = 1 - easeIn.influence / 100;
          });

          // now calculate average speed
          getArrayValue(valueCurrent).forEach(function(valueCurrent, i) {
            averageSpeed[ i ] = (getArrayValue(valueNext)[ i ] - valueCurrent) / durationCurrentToNext;
          });
        break;
      }

      // now calculate the bezier.y
      if(averageSpeed === 0) {
        bezierOut.y = bezierOut.x;
        bezierIn.y = bezierIn.x;
      } else {
        switch(property.propertyValueType) {
          case 'ThreeD_SPATIAL':
          case 'TwoD_SPATIAL':
            // check if this animation is just linear
            if(isEaseLinear) {
              bezierOut.y = bezierOut.x;
              bezierIn.y = bezierIn.x;
            } else {
              bezierOut.y = ((easeCurrent.easeOut.temporalEase[ 0 ].speed) / averageSpeed) * bezierOut.x;
              bezierIn.y =  1 - ((easeNext.easeIn.temporalEase[ 0 ].speed) / averageSpeed) * (influenceIn / 100);
            }
          break;

          case 'ThreeD':
          case 'TwoD':
          case 'OneD':
          case 'COLOR':
            bezierOut.y = [];
            bezierIn.y = [];

            easeNext.easeIn.temporalEase.forEach(function(easeIn, i) {
              easeOut = easeCurrent.easeOut.temporalEase[ i ];

              if(isEaseLinear || averageSpeed[ i ] === 0) {
                bezierOut.y[ i ] = bezierOut.x[ i ];
                bezierIn.y[ i ] = bezierIn.x[ i ];
              } else {
                bezierOut.y[ i ] = (easeOut.speed / averageSpeed[ i ]) * bezierOut.x [ i ];
                bezierIn.y[ i ] = 1 - (easeIn.speed / averageSpeed[ i ]) * (easeIn.influence / 100);
              }
            });
          break;
        }
      }

      addCubicDefininition(out, [ 
        resolveToNonArrayIfPossible(bezierIn.x), 
        resolveToNonArrayIfPossible(bezierIn.y), 
        resolveToNonArrayIfPossible(bezierOut.x), 
        resolveToNonArrayIfPossible(bezierOut.y) 
      ]);
    // this is the last keyframe
    } else {
      addCubicDefininition(out, ['hold']);
    }

    return out;
  });
}

function addCubicDefininition(keyframe, definition) {
  if(keyframe[ 2 ]) {
    if(!keyframe[ 2 ].easeOutCubic) {
      keyframe[ 2 ].easeOutCubic = {};
    }

    keyframe[ 2 ].easeOutCubic.temporalEase = definition;
  }
}
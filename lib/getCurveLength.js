var getArrayValue = require('./getArrayValue');

module.exports = function getCurveLength(valueStart, valueEnd, bezierOut, bezierIn) {
  // this is just to normalize it so that all values are always
  // of type array
  valueStart = getArrayValue(valueStart);
  valueEnd = getArrayValue(valueEnd);
  bezierOut = getArrayValue(bezierOut);
  bezierIn = getArrayValue(bezierIn);

  var totalLength = 0;

  var controlPoint1;
  var controlPoint2;

  var triCoord1;
  var triCoord2;
  var triCoord3;
  var liCoord1;
  var liCoord2;

  var point;
  var pointPrev;
  var pointDistance;
  var t;

  for(var i = 0; i < 2; i++) {
    point = [];
    controlPoint1 = [];
    controlPoint2 = [];
    t = i / 1;
    pointDistance = 0;

    for(var j = 0; j < bezierOut.length; j++) {
      if(controlPoint1[ j ] === undefined) {
        controlPoint1[ j ] = valueStart[ j ] + bezierOut[ j ];
        controlPoint2[ j ] = valueEnd[ j ] + bezierIn[ j ];
      }

      triCoord1 = valueStart[ j ] + (controlPoint1[ j ] - valueStart[ j ]) * t;
      triCoord2 = controlPoint1[ j ] + (controlPoint2[ j ] - controlPoint1[ j ]) * t;
      triCoord3 = controlPoint2[ j ] + (valueEnd[ j ] - controlPoint2[ j ]) * t;
      liCoord1 = triCoord1 + (triCoord2 - triCoord1) * t;
      liCoord2 = triCoord2 + (triCoord3 - triCoord2) * t;

      point.push(liCoord1 + (liCoord2 - liCoord1) * t);

      if(pointPrev) {
        pointDistance += Math.pow(point[ j ] - pointPrev[ j ], 2);
      }
    }

    totalLength += Math.sqrt(pointDistance);
    pointPrev = point;
  }

  return totalLength;
};
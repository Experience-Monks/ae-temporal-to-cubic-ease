# ae-temporal-to-cubic-ease

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

This module is heavily inspired by [`bodymovin`'s](https://github.com/bodymovin/bodymovin) ease conversions.

`ae-temporal-to-cubic-ease` will convert keyframe temporal (or time based) ease data exported from [`ae-to-json`](https://www.npmjs.com/package/ae-to-json) to a cubic ease equation definition.

## Usage

[![NPM](https://nodei.co/npm/ae-temporal-to-cubic-ease.png)](https://www.npmjs.com/package/ae-temporal-to-cubic-ease)

In the following example a JSON file which is exported via the [`ae-to-json`](https://www.npmjs.com/package/ae-to-json) module is passed to `ae-temporal-to-cubic-ease` and when a keyframe is encountered with easing a cubic bezier curve definition which defines an ease is added to it:

```javascript
var exportFromAEtoJSON = require('export-from-ae-to-json.json');

var aeTemporalToCubicEase = require('ae-temporal-to-cubic-ease');

var exportWithCubicEaseOutAdded = aeTemporalToCubicEase(exportFromAEtoJSON);
```

An example export-

Note in the following examples a keyframe is defined as an Array with 3 elements where:

1. The first element contains the time of the keyframe
2. The second element contains the value of the keyframe
3. The third element contains the easing (spatial and temporal) information

Original JSON defining a keyframe:
```json
[
  0,
  [
    200,
    1258,
    1290
  ],
  {
    "easeIn": {
      "type": "linear",
      "temporalEase": [
        {
          "speed": 0,
          "influence": 16.666666667
        }
      ],
      "spatialTangent": [
        0,
        156.33332824707,
        215
      ]
    },
    "easeOut": {
      "type": "linear",
      "temporalEase": [
        {
          "speed": 5601.95746770307,
          "influence": 16.666666667
        }
      ],
      "spatialTangent": [
        0,
        -71.9056625366211,
        -98.8894424438477
      ]
    }
  }
]
```

After running through `ae-temporal-to-cubic-ease`:
```json
[
  0,
  [
    200,
    1258,
    1290
  ],
  {
    "easeIn": {
      "type": "linear",
      "temporalEase": [
        {
          "speed": 0,
          "influence": 16.666666667
        }
      ],
      "spatialTangent": [
        0,
        156.33332824707,
        215
      ]
    },
    "easeOut": {
      "type": "linear",
      "temporalEase": [
        {
          "speed": 5601.95746770307,
          "influence": 16.666666667
        }
      ],
      "spatialTangent": [
        0,
        -71.9056625366211,
        -98.8894424438477
      ]
    },
    "easeOutCubic": {
      "temporalEase": [
        0.8333333333299999,
        1,
        0.16666666667000002,
        0.1791413564363114
      ]
    }
  }
]
```

After running through this module a variable `easeOutCubic` is added to ease definition with a variable which defines temporal/time based easing as a cubic curve. (the same way that CSS ease curves would for instance)


## License

MIT, see [LICENSE.md](http://github.com/mikkoh/ae-temporal-to-cubic-ease/blob/master/LICENSE.md) for details.

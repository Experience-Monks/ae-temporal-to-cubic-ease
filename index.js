var getKeyFrames = require('./lib/getKeyFrames');

module.exports = function(aeJSON) {
  var project = aeJSON.project;

  if(project && project.items) {
    project.items.forEach(function(item) {
      if(item.layers) {
        item.layers.forEach(function(layer) {
          Object.keys(layer.properties).forEach(function(propertyKey) {
            var property = layer.properties[ propertyKey ];

            loopThroughProperty(property);
          });
        });
      }
    });
  }

  return aeJSON;
};

function loopThroughProperty(property) {
  if(property.keyframes) {
    property.keyframes = getKeyFrames(property);
  }

  if(property.propertyType === 'NAMED_GROUP') {
    Object.keys(property).forEach(function(keyProperty) {
      loopThroughProperty(property[ keyProperty ]);
    });
  }
}
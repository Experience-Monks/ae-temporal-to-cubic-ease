module.exports = function getArrayValue(value) {
  return Array.isArray(value) ? value : [ value ];
};
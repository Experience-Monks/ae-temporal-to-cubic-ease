module.exports = function resolveToNonArrayIfPossible(value) {
  return Array.isArray(value) && value.length === 1 ? value[ 0 ] : value;
};
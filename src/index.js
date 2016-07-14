const shift = require('turf-shift-longitude');
const union = require('turf-union');
const polygon = require('turf-polygon');
const normalize = require('geojson-normalize');

const wrap = (feature) => {
  const shifted = shift(feature);
  const polygons = shifted.geometry.coordinates.map(polygon);
  return polygons.slice(1).reduce((acc, polygon) => union(acc, polygon), polygons[0]);
}

module.exports = (inputs) => {
  const features = inputs.reduce((acc, input) => normalize(input).features.map(wrap), []);
  return {
    type: 'FeatureCollection',
    features: features
  };
}

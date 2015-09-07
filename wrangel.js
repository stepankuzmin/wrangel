import clone from 'clone'
import merge from 'turf-merge'
import polygon from 'turf-polygon'
import normalize from 'geojson-normalize'
import collection from 'turf-featurecollection'

var wrapPoint = function ([lng, lat]) {
  if (lng < 0) lng = lng + 360
  return [lng, lat]
}

var wrapLineString = function (coordinates) {
  return coordinates.map(wrapPoint)
}

var wrapPolygon = function (coordinates) {
  return coordinates.map(wrapLineString)
}

var wrapMultiPolygon = function (coordinates) {
  return coordinates.map(wrapPolygon)
}

var wrappers = {
  Point: wrapPoint,
  // MultiPoint: wrapMultiPoint,
  LineString: wrapLineString,
  // MultiLineString: wrapMultiLineString,
  Polygon: wrapPolygon,
  MultiPolygon: wrapMultiPolygon,
  // GeometryCollection: wrapGeometryCollection
}

var wrapFeature = function (feature) {
  var wrappedFeature = clone(feature)
  var wrapper = wrappers[wrappedFeature.geometry.type]

  if (!wrapper) return feature

  var wrappedCoordinates = wrapper(wrappedFeature.geometry.coordinates)
  wrappedFeature.geometry.coordinates = wrappedCoordinates
  return wrappedFeature
}

var wrap = function (feature) {
  var wrappedFeature = wrapFeature(feature)
  var polygons = wrappedFeature.geometry.coordinates.map(polygon)

  return merge(collection(polygons))
}

export default function(inputs) {
  var features = inputs.reduce((acc, input) => normalize(input).features.map(wrap), [])

  return {
    type: 'FeatureCollection',
    features: features
  }
}
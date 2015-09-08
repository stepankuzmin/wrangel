import clone from 'clone'
import merge from 'turf-merge'
import polygon from 'turf-polygon'
import intersect from 'turf-intersect'
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

var intersects = function (polygon1, polygons) {
  return polygons.some((polygon2) => !!intersect(polygon1, polygon2))
}

var byIntersection = function (polygon1, polygons, acc) {
  // var groupedPolygons = clone(polygons)

  if (intersects(polygon, polygons)) {
    console.log('intersects, pushin to existed')
    polygons.push(polygon)
    // return acc + newpolygons
    return [polygons]
  }
  else {
    console.log('not intersects, creating new')
    // return acc + newGroupedPolygons
    return  acc.push([polygon]])
  }
}

var wrap = function (feature) {
  var wrappedFeature = wrapFeature(feature)
  var polygons = wrappedFeature.geometry.coordinates.map(polygon)

  // var head = polygons.shift()
  // var intersecting_polygons = polygons.reduce((acc, polygon) =>
  //   acc.reduce((acc2, polygons) => byIntersection(polygon, polygons, acc2), acc)
  // , [ [head] ])//.map(collection).map(merge)

  // console.log(intersecting_polygons)

  // return merge(collection(intersecting_polygons))

  // return intersecting_polygons.map(collection).map(merge)
  return merge(collection(polygons))
}

export default function(inputs) {
  var features = inputs.reduce((acc, input) => normalize(input).features.map(wrap), [])

  return ''

  // return {
  //   type: 'FeatureCollection',
  //   features: features
  // }
}
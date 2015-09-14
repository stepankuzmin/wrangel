import shift from 'turf-shift-longitude'
import merge from 'turf-merge'
import polygon from 'turf-polygon'
import normalize from 'geojson-normalize'
import collection from 'turf-featurecollection'

var wrap = function (feature) {
  var wrappedFeature = shift(feature)
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
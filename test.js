var test = require('tape');
var wrangel = require('./');

test('wrangel', function (t) {

  t.deepEqual(wrangel([
  {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "MultiPolygon",
          "coordinates": [
            [[[175,70],[175,75],[180,75],[180,70],[175,70]]],
            [[[-180,70],[-180,75],[-175,75],[-175,70],[-180,70]]]
          ]
        }
      }
    ]
  }]),
  {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [[175,70],[175,75],[180,75],[185,75],[185,70],[180,70],[175,70]
            ]
          ]
        }
      }
    ]
  }, 'takes coordinates');

  t.end();

});
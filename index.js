'use strict'

var stream = require('stream')
var Transform = stream.Transform

function log10 (value) {
  return Math.log(value) / Math.LN10
}

function VUMeter (opts) {
  Transform.call(this, { objectMode: true })
}

VUMeter.prototype = Object.create(Transform.prototype)

VUMeter.prototype._transform = function (chunk, encoding, cb) {
  var db = new Float64Array(2)
  var min = new Int16Array(2)
  var max = new Int16Array(2)

  var sample0, sample1
  for (var i = 0; i < chunk.length; i += 4) {
    sample0 = chunk.readInt16LE(i + 0, true)
    sample1 = chunk.readInt16LE(i + 2, true)

    min[0] = (sample0 < min[0] ? sample0 : min[0])
    min[1] = (sample1 < min[1] ? sample1 : min[1])
    max[0] = (sample0 > max[0] ? sample0 : max[0])
    max[1] = (sample1 > max[1] ? sample1 : max[1])
  }

  db[0] = log10(Math.max(max[0], -min[0]) / 32768) * 20
  db[1] = log10(Math.max(max[1], -min[1]) / 32768) * 20

  cb(null, db)
}

module.exports = VUMeter

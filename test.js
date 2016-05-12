/* eslint-env mocha */

var VUMeter = require('./')
var assert = require('assert')

function log10 (value) {
  return Math.log(value) / Math.LN10
}

var silence = new Int16Array([0, 0, 0, 0, 0, 0, 0, 0])
var lightNoise = new Int16Array([234, -654, 823, -935, 385, -842, 653, -128])
var loudNoise = new Int16Array([-1854, 8265, -9375, 8402, -9223, 9951, -9432, 9432])

var silenceDb = -Infinity
var lightNoiseLeftDb = log10(823 / 32768) * 20
var lightNoiseRightDb = log10(935 / 32768) * 20
var loudNoiseLeftDb = log10(9432 / 32768) * 20
var loudNoiseRightDb = log10(9951 / 32768) * 20

var testCases = [
  {
    name: 'silence',
    chunks: [ silence, silence ],
    result: [ silenceDb, silenceDb, silenceDb, silenceDb ]
  },
  {
    name: 'light noise',
    chunks: [ lightNoise, lightNoise ],
    result: [ lightNoiseLeftDb, lightNoiseRightDb, lightNoiseLeftDb, lightNoiseRightDb ]
  },
  {
    name: 'loud noise',
    chunks: [ loudNoise, loudNoise ],
    result: [ loudNoiseLeftDb, loudNoiseRightDb, loudNoiseLeftDb, loudNoiseRightDb ]
  },
  {
    name: 'mixed noise',
    chunks: [ loudNoise, lightNoise ],
    result: [ loudNoiseLeftDb, loudNoiseRightDb, lightNoiseLeftDb, lightNoiseRightDb ]
  }
]

describe('VU Meter', function () {
  testCases.forEach(function (testCase) {
    it('measures ' + testCase.name, function (done) {
      var amplitudes = []
      var meter = new VUMeter()

      meter.on('data', function (data) {
        amplitudes.push(data[0], data[1])
      })

      meter.on('end', function () {
        assert.deepEqual(amplitudes, testCase.result)
        done()
      })

      testCase.chunks.forEach(function (chunk) {
        var buffer = new Buffer(chunk.length * 2)

        for (var i = 0; i < chunk.length; i++) {
          buffer.writeInt16LE(chunk[i], i * 2)
        }

        meter.write(buffer)
      })

      meter.end()
    })
  })
})

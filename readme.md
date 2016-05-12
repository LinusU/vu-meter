# VU Meter

A VU Meter for Node.js, works on streams of raw pcm data.

## Installation

```sh
npm install --save vu-meter
```

## Usage

```js
const VUMeter = require('vu-meter')

const meter = new VUMeter()

process.stdin.pipe(meter)

meter.on('data', (data) => {
  data[0] // dB value of left channel
  data[1] // dB value of right channel
})
```

## API

### `new VUMeter()`

Create a new transform stream that emits the current amplitude in decibels.

Currently only 2-channel 16-bit little-endian signed integer pcm encoded data is supported.

### `data` event

Emits a `Float64Array` that contains the amplitude of the left and right channel.

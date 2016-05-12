# midi-file
```
npm install midi-file
```

The parser is loosely based on [midi-file-parser](https://github.com/NHQ/midi-file-parser) and [jasmid](https://github.com/gasman/jasmid), but totally rewritten to use arrays instead of strings for portability.

### Usage

```js
var fs = require('fs')
var parseMidi = require('midi-file').parseMidi
var writeMidi = require('midi-file').writeMidi

// Read MIDI file into a buffer
var input = fs.readFileSync('star_wars.mid')

// Parse it into an intermediate representation
// This will take any array-like object.  It just needs to support .length, .slice, and the [] indexed element getter.
// Buffers do that, so do native JS arrays, typed arrays, etc.
var parsed = parseMidi(input)

// Turn the intermediate representation back into raw bytes
var output = writeMidi(parsed)

// Note that the output is simply an array of byte values.  writeFileSync wants a buffer, so this will convert accordingly.
// Using native Javascript arrays makes the code portable to the browser or non-node environments
var outputBuffer = new Buffer(output)

// Write to a new MIDI file.  it should match the original
fs.writeFileSync('copy_star_wars.mid', outputBuffer)
```

The intermediate representation has a 'header' and 'tracks', and each track is an array of events.

The output of writeMidi may not be exactly the same as the input, due to some ambiguities in the file format.  For example, the input may not have used running status bytes to compress consecutive events.  Also, some files use 0x90 noteOn messages with velocity 0 to mean noteOff, and others use 0x80.  These considerations could be provided as options in the future.


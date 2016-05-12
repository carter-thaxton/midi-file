// data can be any array-like object.  It just needs to support .length, .slice, and an element getter []

function parseMidi(data) {
  var p = new Parser(data)

  var headerChunk = p.readChunk()
  if (headerChunk.id != 'MThd')
    throw "Bad MIDI file.  Expected 'MHdr', got: '" + headerChunk.id + "' at " + p.pos
  var header = parseHeader(headerChunk.data)

  var tracks = []
  for (var i=0; !p.eof() && i < header.numTracks; i++) {
    var trackChunk = p.readChunk()
    if (trackChunk.id != 'MTrk')
      throw "Bad MIDI file.  Expected 'MTrk', got: '" + trackChunk.id + "' at " + p.pos
    var track = parseTrack(trackChunk.data)
    tracks.push(track)
  }

  return {
    header: header,
    tracks: tracks
  }
}


function parseHeader(data) {
  var p = new Parser(data)

  var format = p.readUInt16()
  var numTracks = p.readUInt16()

  var result = {
    format: format,
    numTracks: numTracks
  }

  var timeDivision = p.readUInt16()
  if (timeDivision & 0x8000) {
    result.framesPerSecond = 0x100 - (timeDivision >> 8)
    result.ticksPerFrame = timeDivision & 0xFF
  } else {
    result.ticksPerBeat = timeDivision
  }

  return result
}

function parseTrack(data) {
  var p = new Parser(data)

  var events = []
  while (!p.eof()) {
    var event = readEvent()
    events.push(event)
  }

  return events

  var lastEventTypeByte = null

  function readEvent() {
    var result = {}
    result.deltaTime = p.readVarInt()

    var eventTypeByte = p.readUInt8()

    if ((eventTypeByte & 0xf0) === 0xf0) {
      // system / meta event
      if (eventTypeByte === 0xff) {
        // meta event
        result.meta = true
        var metatypeByte = p.readUInt8()
        var length = p.readVarInt()
        switch (metatypeByte) {
          case 0x00:
            result.type = 'sequenceNumber'
            if (length !== 2) throw "Expected length for sequenceNumber event is 2, got " + length
            result.number = stream.readUInt16()
            return result
          case 0x01:
            result.type = 'text'
            result.text = p.readString(length)
            return result
          case 0x02:
            result.type = 'copyrightNotice'
            result.text = p.readString(length)
            return result
          case 0x03:
            result.type = 'trackName'
            result.text = p.readString(length)
            return result
          case 0x04:
            result.type = 'instrumentName'
            result.text = p.readString(length)
            return result
          case 0x05:
            result.type = 'lyrics'
            result.text = p.readString(length)
            return result
          case 0x06:
            result.type = 'marker'
            result.text = p.readString(length)
            return result
          case 0x07:
            result.type = 'cuePoint'
            result.text = p.readString(length)
            return result
          case 0x20:
            result.type = 'channelPrefix'
            if (length != 1) throw "Expected length for channelPrefix event is 1, got " + length
            result.channel = p.readUInt8()
            return result
          case 0x21:
            result.type = 'portPrefix'
            if (length != 1) throw "Expected length for portPrefix event is 1, got " + length
            result.port = p.readUInt8()
            return result
          case 0x2f:
            result.type = 'endOfTrack'
            if (length != 0) throw "Expected length for endOfTrack event is 0, got " + length
            return result
          case 0x51:
            result.type = 'setTempo';
            if (length != 3) throw "Expected length for setTempo event is 3, got " + length
            result.microsecondsPerBeat = p.readUInt24()
            return result
          case 0x54:
            result.type = 'smpteOffset';
            if (length != 5) throw "Expected length for smpteOffset event is 5, got " + length
            var hourByte = p.readUInt8()
            var FRAME_RATES = { 0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30 }
            result.frameRate = FRAME_RATES[hourByte & 0x60]
            result.hour = hourByte & 0x1f
            result.min = p.readUInt8()
            result.sec = p.readUInt8()
            result.frame = p.readUInt8()
            result.subframe = p.readUInt8()
            return result
          case 0x58:
            result.type = 'timeSignature'
            if (length != 4) throw "Expected length for timeSignature event is 4, got " + length
            result.numerator = p.readUInt8()
            result.denominator = (1 << p.readUInt8())
            result.metronome = p.readUInt8()
            result.thirtyseconds = p.readUInt8()
            return result
          case 0x59:
            result.type = 'keySignature'
            if (length != 2) throw "Expected length for keySignature event is 2, got " + length
            result.key = p.readInt8()
            result.scale = p.readUInt8()
            return result
          case 0x7f:
            result.type = 'sequencerSpecific'
            result.data = p.readBytes(length)
            return result
          default:
            result.type = 'unknownMeta'
            result.data = p.readBytes(length)
            result.metatypeByte = metatypeByte
            return result
        }
      } else if (eventTypeByte == 0xf0) {
        result.type = 'sysEx'
        var length = p.readVarInt()
        result.data = p.readBytes(length)
        return result
      } else if (eventTypeByte == 0xf7) {
        result.type = 'endSysEx'
        var length = p.readVarInt()
        result.data = p.readBytes(length)
        return result
      } else {
        throw "Unrecognised MIDI event type byte: " + eventTypeByte
      }
    } else {
      // channel event
      var param1
      if ((eventTypeByte & 0x80) === 0) {
        // running status - reuse lastEventTypeByte as the event type.
        // eventTypeByte is actually the first parameter
        if (lastEventTypeByte === null)
          throw "Running status byte encountered before status byte"
        param1 = eventTypeByte
        eventTypeByte = lastEventTypeByte
      } else {
        param1 = p.readUInt8()
        lastEventTypeByte = eventTypeByte
      }
      var eventType = eventTypeByte >> 4
      result.channel = eventTypeByte & 0x0f
      switch (eventType) {
        case 0x08:
          result.type = 'noteOff'
          result.noteNumber = param1
          result.velocity = p.readUInt8()
          return result
        case 0x09:
          var velocity = p.readUInt8()
          result.type = velocity === 0 ? 'noteOff' : 'noteOn'
          result.noteNumber = param1
          result.velocity = velocity
          return result
        case 0x0a:
          result.type = 'noteAftertouch'
          result.noteNumber = param1
          result.amount = p.readUInt8()
          return result
        case 0x0b:
          result.type = 'controller'
          result.controllerType = param1
          result.value = p.readUInt8()
          return result
        case 0x0c:
          result.type = 'programChange'
          result.programNumber = param1
          return result
        case 0x0d:
          result.type = 'channelAftertouch'
          result.amount = param1
          return result
        case 0x0e:
          result.type = 'pitchBend'
          result.value = param1 + (p.readUInt8() << 7)
          return result
        default:
          throw "Unrecognised MIDI event type: " + eventType
      }
    }
  }
}

function Parser(data) {
  this.buffer = data
  this.bufferLen = this.buffer.length
  this.pos = 0
}

Parser.prototype.eof = function() {
  return this.pos >= this.bufferLen
}

Parser.prototype.readUInt8 = function() {
  var result = this.buffer[this.pos]
  this.pos += 1
  return result
}

Parser.prototype.readInt8 = function() {
  var u = this.readUInt8()
  if (u & 0x80)
    return u - 0x100
  else
    return u
}

Parser.prototype.readUInt16 = function() {
  var b0 = this.readUInt8(),
      b1 = this.readUInt8()

    return (b0 << 8) + b1
}

Parser.prototype.readInt16 = function() {
  var u = this.readUInt16()
  if (u & 0x8000)
    return u - 0x10000
  else
    return u
}

Parser.prototype.readUInt24 = function() {
  var b0 = this.readUInt8(),
      b1 = this.readUInt8(),
      b2 = this.readUInt8()

    return (b0 << 16) + (b1 << 8) + b1
}

Parser.prototype.readInt24 = function() {
  var u = this.readUInt24()
  if (u & 0x800000)
    return u - 0x1000000
  else
    return u
}

Parser.prototype.readUInt32 = function() {
  var b0 = this.readUInt8(),
      b1 = this.readUInt8(),
      b2 = this.readUInt8(),
      b3 = this.readUInt8()

    return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3
}

Parser.prototype.readBytes = function(len) {
  var bytes = this.buffer.slice(this.pos, this.pos + len)
  this.pos += len
  return bytes
}

Parser.prototype.readString = function(len) {
  var bytes = this.readBytes(len)
  return String.fromCharCode.apply(null, bytes)
}

Parser.prototype.readVarInt = function() {
  var result = 0
  while (!this.eof()) {
    var b = this.readUInt8()
    if (b & 0x80) {
      result += (b & 0x7f)
      result <<= 7
    } else {
      // b is last byte
      return result + b
    }
  }
  // premature eof
  return result
}

Parser.prototype.readChunk = function() {
  var id = this.readString(4)
  var length = this.readUInt32()
  var data = this.readBytes(length)
  return {
    id: id,
    length: length,
    data: data
  }
}

module.exports = parseMidi

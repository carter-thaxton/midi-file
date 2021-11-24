import { writeMidi, parseMidi, MidiData } from "..";

var errors = 0;
const assert = (condition: boolean, msg?: string) => {
  if (!condition) {
    errors++;
    console.error(`Assertion failed: ${msg}`);
  }
};

const compare = (x: any, y: any, id: string, deep?: number) => {
  deep = deep || 0;
  const _assert = (condition: boolean) =>
    assert(condition, `${id} x=${x},y=${y}`);
  const current = errors;
  const next = deep + 1;
  if (x == null) {
    _assert(y === null);
  } else if (Array.isArray(x) || x instanceof Uint8Array) {
    _assert(Array.isArray(y) || y instanceof Uint8Array);
    _assert(x.length == y.length);
    for (let i = 0; i < x.length; ++i) {
      compare(x[i], y[i], `${id}[${i}]`, next);
    }
  } else if (typeof x == "object") {
    _assert(typeof y == "object");
    const [xkeys, ykeys] = [Object.keys(x), Object.keys(y)];
    xkeys.forEach((k) => compare(x[k], y[k], `${id}.${k}`, next));
    ykeys.filter(x=>!xkeys.includes(x)).forEach((k) => compare(x[k], y[k], `${id}.${k}`, next));
  } else {
    _assert(x === y);
  }
  if (!deep) {
    const pass = current == errors;
    console.log("[Test]", id, pass ? "PASS" : "FAIL");
  }
};
const testCompare1={
  num:10,
  str:'string',
  obj:{
    key:12,
    array:[1,2,3]
  },
  arr:[1,2,3,{
    key:'value'
  }],
  xKey:'value'
};
const testCompare2={
  num:12,
  str:'string1',
  obj:{
    key:12,
    array:[3,2,1]
  },
  arr:[3,2,1,{
    key:'value1',
    key2:'value2'
  }],
  yKey:'value'
};
compare([testCompare1],[testCompare1],"testCompare1");
compare([testCompare1],[testCompare2],"[Should FAIL] testCompare2");
compare(10,errors,"testCompare");

errors=0;
const testDefault: MidiData = {
  header: {
    format: 0,
    numTracks: 1,
    ticksPerBeat: 480,
  },
  tracks: [
    [
      {
        deltaTime: 0,
        meta: true,
        type: "setTempo",
        microsecondsPerBeat: 500000,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "sequenceNumber",
        number: 1,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "smpteOffset",
        frameRate: 24,
        hour: 1,
        min: 2,
        sec: 3,
        frame: 4,
        subFrame: 5,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "timeSignature",
        numerator: 1,
        denominator: 2,
        metronome: 3,
        thirtyseconds: 4,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "keySignature",
        key: 0,
        scale: 1,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "sequencerSpecific",
        data: [1, 2, 3, 4],
      },
      {
        deltaTime: 0,
        meta: true,
        type: "instrumentName",
        text: "instrumentName",
      },
      {
        deltaTime: 0,
        type: "sysEx",
        data: [1, 2, 3, 4],
      },
      {
        deltaTime: 0,
        type: "endSysEx",
        data: [1, 2, 3, 4],
      },
      {
        deltaTime: 1,
        meta: true,
        type: "text",
        text: "text",
      },
      {
        deltaTime: 2,
        meta: true,
        type: "copyrightNotice",
        text: "copyrightNotice",
      },
      {
        deltaTime: 3,
        meta: true,
        type: "trackName",
        text: "trackName",
      },
      {
        deltaTime: 4,
        meta: true,
        type: "instrumentName",
        text: "instrumentName",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "lyrics",
        text: "lyrics",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "marker",
        text: "marker",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "cuePoint",
        text: "cuePoint",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "channelPrefix",
        channel: 0,
      },
      {
        deltaTime: 6,
        meta: true,
        type: "portPrefix",
        port: 0,
      },
      {
        deltaTime: 7,
        channel: 0,
        type: "noteOn",
        noteNumber: 60,
        velocity: 80,
      },
      {
        deltaTime: 7,
        channel: 0,
        type: "noteOn",
        noteNumber: 60,
        velocity: 80,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "noteOff",
        noteNumber: 60,
        velocity: 0,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "controller",
        controllerType: 0,
        value: 0,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "noteAftertouch",
        noteNumber: 60,
        amount: 0,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "programChange",
        programNumber: 1,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "channelAftertouch",
        amount: 1,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "pitchBend",
        value: 10,
      },
      {
        deltaTime: 8,
        meta: true,
        type: "endOfTrack",
      },
    ],
  ],
};
const testWithRunningOpt: MidiData = {
  header: {
    format: 0,
    numTracks: 1,
    ticksPerBeat: 480,
  },
  tracks: [
    [
      {
        deltaTime: 0,
        meta: true,
        type: "setTempo",
        microsecondsPerBeat: 500000,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "sequenceNumber",
        number: 1,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "smpteOffset",
        frameRate: 24,
        hour: 1,
        min: 2,
        sec: 3,
        frame: 4,
        subFrame: 5,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "timeSignature",
        numerator: 1,
        denominator: 2,
        metronome: 3,
        thirtyseconds: 4,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "keySignature",
        key: 0,
        scale: 1,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "sequencerSpecific",
        data: [1, 2, 3, 4],
      },
      {
        deltaTime: 0,
        meta: true,
        type: "instrumentName",
        text: "instrumentName",
      },
      {
        deltaTime: 0,
        type: "sysEx",
        data: [1, 2, 3, 4],
      },
      {
        deltaTime: 0,
        type: "endSysEx",
        data: [1, 2, 3, 4],
      },
      {
        deltaTime: 1,
        meta: true,
        type: "text",
        text: "text",
      },
      {
        deltaTime: 2,
        meta: true,
        type: "copyrightNotice",
        text: "copyrightNotice",
      },
      {
        deltaTime: 3,
        meta: true,
        type: "trackName",
        text: "trackName",
      },
      {
        deltaTime: 4,
        meta: true,
        type: "instrumentName",
        text: "instrumentName",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "lyrics",
        text: "lyrics",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "marker",
        text: "marker",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "cuePoint",
        text: "cuePoint",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "channelPrefix",
        channel: 0,
      },
      {
        deltaTime: 6,
        meta: true,
        type: "portPrefix",
        port: 0,
      },
      {
        deltaTime: 7,
        channel: 0,
        type: "noteOn",
        noteNumber: 60,
        velocity: 80,
      },
      {
        deltaTime: 7,
        running: true,
        channel: 0,
        type: "noteOn",
        noteNumber: 60,
        velocity: 80,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "noteOff",
        noteNumber: 60,
        velocity: 0,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "controller",
        controllerType: 0,
        value: 0,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "noteAftertouch",
        noteNumber: 60,
        amount: 0,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "programChange",
        programNumber: 1,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "channelAftertouch",
        amount: 1,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "pitchBend",
        value: 10,
      },
      {
        deltaTime: 8,
        meta: true,
        type: "endOfTrack",
      },
    ],
  ],
};
const testWithRunningAndUseByte9ForNoteOffOpt: MidiData = {
  header: {
    format: 0,
    numTracks: 1,
    ticksPerBeat: 480,
  },
  tracks: [
    [
      {
        deltaTime: 0,
        meta: true,
        type: "setTempo",
        microsecondsPerBeat: 500000,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "sequenceNumber",
        number: 1,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "smpteOffset",
        frameRate: 24,
        hour: 1,
        min: 2,
        sec: 3,
        frame: 4,
        subFrame: 5,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "timeSignature",
        numerator: 1,
        denominator: 2,
        metronome: 3,
        thirtyseconds: 4,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "keySignature",
        key: 0,
        scale: 1,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "sequencerSpecific",
        data: [1, 2, 3, 4],
      },
      {
        deltaTime: 0,
        meta: true,
        type: "instrumentName",
        text: "instrumentName",
      },
      {
        deltaTime: 0,
        type: "sysEx",
        data: [1, 2, 3, 4],
      },
      {
        deltaTime: 0,
        type: "endSysEx",
        data: [1, 2, 3, 4],
      },
      {
        deltaTime: 1,
        meta: true,
        type: "text",
        text: "text",
      },
      {
        deltaTime: 2,
        meta: true,
        type: "copyrightNotice",
        text: "copyrightNotice",
      },
      {
        deltaTime: 3,
        meta: true,
        type: "trackName",
        text: "trackName",
      },
      {
        deltaTime: 4,
        meta: true,
        type: "instrumentName",
        text: "instrumentName",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "lyrics",
        text: "lyrics",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "marker",
        text: "marker",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "cuePoint",
        text: "cuePoint",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "channelPrefix",
        channel: 0,
      },
      {
        deltaTime: 6,
        meta: true,
        type: "portPrefix",
        port: 0,
      },
      {
        deltaTime: 7,
        channel: 0,
        type: "noteOn",
        noteNumber: 60,
        velocity: 80,
      },
      {
        deltaTime: 7,
        running: true,
        channel: 0,
        type: "noteOn",
        noteNumber: 60,
        velocity: 80,
      },
      {
        deltaTime: 8,
        running: true,
        channel: 0,
        type: "noteOff",
        noteNumber: 60,
        velocity: 0,
        byte9: true,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "controller",
        controllerType: 0,
        value: 0,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "noteAftertouch",
        noteNumber: 60,
        amount: 0,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "programChange",
        programNumber: 1,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "channelAftertouch",
        amount: 1,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "pitchBend",
        value: 10,
      },
      {
        deltaTime: 8,
        meta: true,
        type: "endOfTrack",
      },
    ],
  ],
};

const testWithUseByte9ForNoteOffOpt: MidiData = {
  header: {
    format: 0,
    numTracks: 1,
    ticksPerBeat: 480,
  },
  tracks: [
    [
      {
        deltaTime: 0,
        meta: true,
        type: "setTempo",
        microsecondsPerBeat: 500000,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "sequenceNumber",
        number: 1,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "smpteOffset",
        frameRate: 24,
        hour: 1,
        min: 2,
        sec: 3,
        frame: 4,
        subFrame: 5,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "timeSignature",
        numerator: 1,
        denominator: 2,
        metronome: 3,
        thirtyseconds: 4,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "keySignature",
        key: 0,
        scale: 1,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "sequencerSpecific",
        data: [1, 2, 3, 4],
      },
      {
        deltaTime: 0,
        meta: true,
        type: "instrumentName",
        text: "instrumentName",
      },
      {
        deltaTime: 0,
        type: "sysEx",
        data: [1, 2, 3, 4],
      },
      {
        deltaTime: 0,
        type: "endSysEx",
        data: [1, 2, 3, 4],
      },
      {
        deltaTime: 1,
        meta: true,
        type: "text",
        text: "text",
      },
      {
        deltaTime: 2,
        meta: true,
        type: "copyrightNotice",
        text: "copyrightNotice",
      },
      {
        deltaTime: 3,
        meta: true,
        type: "trackName",
        text: "trackName",
      },
      {
        deltaTime: 4,
        meta: true,
        type: "instrumentName",
        text: "instrumentName",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "lyrics",
        text: "lyrics",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "marker",
        text: "marker",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "cuePoint",
        text: "cuePoint",
      },
      {
        deltaTime: 5,
        meta: true,
        type: "channelPrefix",
        channel: 0,
      },
      {
        deltaTime: 6,
        meta: true,
        type: "portPrefix",
        port: 0,
      },
      {
        deltaTime: 7,
        channel: 0,
        type: "noteOn",
        noteNumber: 60,
        velocity: 80,
      },
      {
        deltaTime: 7,
        running: true,
        channel: 0,
        type: "noteOn",
        noteNumber: 60,
        velocity: 80,
      },
      {
        deltaTime: 8,
        running: true,
        channel: 0,
        type: "noteOff",
        noteNumber: 60,
        velocity: 0,
        byte9: true,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "controller",
        controllerType: 0,
        value: 0,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "noteAftertouch",
        noteNumber: 60,
        amount: 0,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "programChange",
        programNumber: 1,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "channelAftertouch",
        amount: 1,
      },
      {
        deltaTime: 8,
        channel: 0,
        type: "pitchBend",
        value: 10,
      },
      {
        deltaTime: 8,
        meta: true,
        type: "endOfTrack",
      },
    ],
  ],
};

compare(testDefault, parseMidi(writeMidi(testDefault)), "testDefault");
compare(
  testWithRunningOpt,
  parseMidi(writeMidi(testWithRunningOpt, { running: true })),
  "testWithRunningOpt"
);
compare(
  testWithRunningAndUseByte9ForNoteOffOpt,
  parseMidi(
    writeMidi(testWithRunningAndUseByte9ForNoteOffOpt, {
      running: true,
      useByte9ForNoteOff: true,
    })
  ),
  "testWithRunningAndUseByte9ForNoteOffOpt"
);
compare(
  testWithUseByte9ForNoteOffOpt,
  parseMidi(
    writeMidi(testWithUseByte9ForNoteOffOpt, { useByte9ForNoteOff: true })
  ),
  "testWithUseByte9ForNoteOffOpt"
);

const testHeader1: MidiData = {
  header: {
    format: 0,
    numTracks: 0,
    timeDivision: 120,
  },
  tracks: [],
};
const testHeader2: MidiData = {
  header: {
    format: 0,
    numTracks: 0,
    ticksPerBeat: 480,
  },
  tracks: [],
};
const testHeader3: MidiData = {
  header: {
    format: 0,
    numTracks: 0,
    framesPerSecond: 60,
    ticksPerFrame: 80,
  },
  tracks: [],
};

compare(
  120,
  parseMidi(writeMidi(testHeader1)).header.ticksPerBeat,
  "testHeader1"
);
compare(
  480,
  parseMidi(writeMidi(testHeader2)).header.ticksPerBeat,
  "testHeader2"
);
compare(testHeader3, parseMidi(writeMidi(testHeader3)), "testHeader3");
const testNoMeta: MidiData = {
  header: {
    format: 0,
    numTracks: 1,
    ticksPerBeat: 480,
  },
  tracks: [
    [
      {
        deltaTime: 0,
        type: "setTempo",
        microsecondsPerBeat: 500000,
      },
    ],
  ],
};
const testNoMetaResult: MidiData = {
  header: {
    format: 0,
    numTracks: 1,
    ticksPerBeat: 480,
  },
  tracks: [
    [
      {
        deltaTime: 0,
        meta: true,
        type: "setTempo",
        microsecondsPerBeat: 500000,
      },
    ],
  ],
};
compare(testNoMetaResult, parseMidi(writeMidi(testNoMeta)), "testNoMeta");

const YourCase: MidiData = {
  header: {
    format: 1,
    numTracks: 2,
    ticksPerBeat: 960,
  },
  tracks: [
    [
      {
        deltaTime: 0,
        meta: true,
        type: "trackName",
        text: "midi_export",
      },
      {
        deltaTime: 0,
        meta: true,
        type: "timeSignature",
        numerator: 4,
        denominator: 4,
        metronome: 24,
        thirtyseconds: 8,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "setTempo",
        microsecondsPerBeat: 500000,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "endOfTrack",
      },
    ],
    [
      {
        deltaTime: 0,
        channel: 0,
        type: "noteOn",
        noteNumber: 60,
        velocity: 96,
      },
      {
        deltaTime: 0,
        channel: 0,
        type: "noteOn",
        noteNumber: 57,
        velocity: 96,
      },
      {
        deltaTime: 3840,
        channel: 0,
        type: "noteOff",
        noteNumber: 60,
        velocity: 0,
      },
      {
        deltaTime: 0,
        channel: 0,
        type: "noteOff",
        noteNumber: 57,
        velocity: 0,
      },
      {
        deltaTime: 0,
        meta: true,
        type: "endOfTrack",
      },
    ],
  ],
};
compare(YourCase, parseMidi(writeMidi(YourCase)), "YourCase");

compare(
  testDefault,
  parseMidi(new Uint8Array(writeMidi(testDefault))),
  "Uint8Array"
);

console.log(`errors=${errors}`);

declare var process: { exitCode?: number };
process.exitCode = errors ? -1 : 0;

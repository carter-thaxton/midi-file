export interface MidiHeader {
  format: 0 | 1 | 2;
  numTracks: number;
  timeDivision?: number;
  framesPerSecond?: number;
  ticksPerFrame?: number;
  ticksPerBeat?: number;
}
export interface MidiBaseEvent<T> {
  deltaTime: number;
  type: T;
}
export interface MidiMetaEvent<T> extends MidiBaseEvent<T> {
  meta?: true;
}
export interface MidiSmpteOffsetMixins {
  frameRate: 24 | 25 | 26 | 29 | 30;
  hour: number;
  min: number;
  sec: number;
  frame: number;
  subFrame: number;
}
export interface MidiTimeSignatureMixins {
  numerator: number;
  denominator: number;
  metronome: number;
  thirtyseconds: number;
}
export interface MidiKeySignatureMixins {
  key: number;
  scale: number;
}
export interface MidiDataMixins {
  data: ArrayLike<number>;
}
export interface MidiUnknownMixins {
  data: ArrayLike<number>;
  metatypeByte: number;
}
export interface MidiNumberMixins {
  number: number;
}
export interface MidiTextMixins {
  text: string;
}
export type MidiSequenceNumberEvent = MidiMetaEvent<"sequenceNumber"> &
  MidiNumberMixins;
export type MidiTextEvent = MidiMetaEvent<"text"> & MidiTextMixins;
export type MidiCopyrightNoticeEvent = MidiMetaEvent<"copyrightNotice"> &
  MidiTextMixins;
export type MidiTrackNameEvent = MidiMetaEvent<"trackName"> & MidiTextMixins;
export type MidiInstrumentNameEvent = MidiMetaEvent<"instrumentName"> &
  MidiTextMixins;
export type MidiLyricsEvent = MidiMetaEvent<"lyrics"> & MidiTextMixins;
export type MidiMarkerEvent = MidiMetaEvent<"marker"> & MidiTextMixins;
export type MidiCuePointEvent = MidiMetaEvent<"cuePoint"> & MidiTextMixins;
export type MidiChannelPrefixEvent = MidiMetaEvent<"channelPrefix"> & {
  channel: number;
};
export type MidiPortPrefixEvent = MidiMetaEvent<"portPrefix"> & {
  port: number;
};
export type MidiEndOfTrackEvent = MidiMetaEvent<"endOfTrack">;
export type MidiSetTempoEvent = MidiMetaEvent<"setTempo"> & {
  microsecondsPerBeat: number;
};
export type MidiSmpteOffsetEvent = MidiMetaEvent<"smpteOffset"> &
  MidiSmpteOffsetMixins;
export type MidiTimeSignatureEvent = MidiMetaEvent<"timeSignature"> &
  MidiTimeSignatureMixins;
export type MidiKeySignatureEvent = MidiMetaEvent<"keySignature"> &
  MidiKeySignatureMixins;
export type MidiSequencerSpecificEvent = MidiMetaEvent<"sequencerSpecific"> &
  MidiDataMixins;
export type MidiUnknownEvent = MidiMetaEvent<"unknownMeta"> & MidiUnknownMixins;

export type MidiSysExEvent = MidiBaseEvent<"sysEx"> & MidiDataMixins;
export type MidiEndSysExEvent = MidiBaseEvent<"endSysEx"> & MidiDataMixins;

export interface MidiNoteMixins {
  noteNumber: number;
  velocity: number;
  byte9?: true;
}
export interface MidiNoteAftertouchMixins {
  noteNumber: number;
  amount: number;
}
export interface MidiControllerMixins {
  controllerType: number;
  value: number;
}
export interface MidiChannelEvent<T> extends MidiBaseEvent<T> {
  running?: true;
  channel: number;
}
export type MidiNoteOnEvent = MidiChannelEvent<"noteOn"> & MidiNoteMixins;
export type MidiNoteOffEvent = MidiChannelEvent<"noteOff"> & MidiNoteMixins;
export type MidiNoteAftertouchEvent = MidiChannelEvent<"noteAftertouch"> &
  MidiNoteAftertouchMixins;
export type MidiControllerEvent = MidiChannelEvent<"controller"> &
  MidiControllerMixins;
export type MidiProgramChangeEvent = MidiChannelEvent<"programChange"> & {
  programNumber: number;
};
export type MidiChannelAftertouchEvent =
  MidiChannelEvent<"channelAftertouch"> & {
    amount: number;
  };
export type MidiPitchBendEvent = MidiChannelEvent<"pitchBend"> & {
  value: number;
};

export type MidiEvent =
  | MidiSequenceNumberEvent
  | MidiTextEvent
  | MidiCopyrightNoticeEvent
  | MidiTrackNameEvent
  | MidiInstrumentNameEvent
  | MidiLyricsEvent
  | MidiMarkerEvent
  | MidiCuePointEvent
  | MidiChannelPrefixEvent
  | MidiPortPrefixEvent
  | MidiEndOfTrackEvent
  | MidiSetTempoEvent
  | MidiSmpteOffsetEvent
  | MidiTimeSignatureEvent
  | MidiKeySignatureEvent
  | MidiSequencerSpecificEvent
  | MidiUnknownEvent
  | MidiSysExEvent
  | MidiEndSysExEvent
  | MidiControllerEvent
  | MidiProgramChangeEvent
  | MidiChannelAftertouchEvent
  | MidiPitchBendEvent
  | MidiNoteAftertouchEvent
  | MidiNoteOnEvent
  | MidiNoteOffEvent;

export interface MidiData {
  header: MidiHeader;
  tracks: Array<MidiEvent[]>;
}

export function parseMidi(data: ArrayLike<number>): MidiData;

export interface MidiWriteOption {
  running?: boolean; //reuse previous eventTypeByte when possible, to compress file
  useByte9ForNoteOff?: boolean; //use 0x09 for noteOff when velocity is zero
}
export function writeMidi(
  data: MidiData,
  opts?: MidiWriteOption
): Array<number>;

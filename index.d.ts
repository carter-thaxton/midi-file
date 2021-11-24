declare module 'midi-file' {
    interface MidiHeader {
        format: 0 | 1 | 2;
        numTracks: number;
        ticksPerBeat: number;
    }

    interface MidiEvent {
        deltaTime: number;
        meta?: true;
        channel?: number;
        type: "noteOn" | "noteOff" | 
        "trackName" | "endOfTrack" 
        | "timeSignature" | "setTempo";
        noteNumber?: number;
        velocity?: number;
        text?: string;
    }

    interface TypeJsonOfMidi {
        header: MidiHeader;
        tracks: Array<Array<MidiEvent>>;
    }

    function parseMidi(data: Buffer): TypeJsonOfMidi;
    function writeMidi(data: TypeJsonOfMidi): Array<any>;
}

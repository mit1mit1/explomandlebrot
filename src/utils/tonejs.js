var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import PianoMp3 from "tonejs-instrument-piano-mp3";
export var pitchNames = [
    // "E3",
    // "F3",
    // "F#3",
    // "G3",
    // "G#3",
    "A3",
    "A#3",
    "B3",
    "C4",
    "C#4",
    "D4",
    "D#4",
    "E4",
    "F4",
    "F#4",
    "G4",
    "G#4",
    "A4",
    "A#4",
    "B4",
    "C5",
    "C#5",
    "D5",
    "D#5",
    "E5",
    "F5",
    "F#5",
    "G5",
    "G#5",
    "A5",
    "A#5",
    "B5",
];
export var durationNames = [
    "16n",
    "8n",
    "8n.",
    "4n",
    "4n.",
    "2n",
    "2n.",
    "1n",
    "1n.",
    "16t",
    "8t",
    "4t",
    "2t",
];
export var addDurationObjects = function (durationObject, durations) {
    var newObject = __assign({}, durationObject);
    for (var i = 0; i < durations.length; i++) {
        var based = durations[i];
        newObject[based] = (newObject[based] || 0) + 1;
    }
    return newObject;
};
export var instrument = new PianoMp3({
    minify: true,
}).toDestination("main");

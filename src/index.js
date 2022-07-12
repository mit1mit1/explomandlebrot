import { addDurationObjects, durationNames, instrument, pitchNames, } from "./utils/tonejs";
import * as Tone from "tone";
var calculatedNumbers = new Map();
var availableColorsMe = [
    "#03fcfc",
    "#03fc5e",
    "#20fc03",
    "#ea00ff",
    "#ff0062",
    "#ff6200",
    "#00ffbb",
    "#000473",
    "#910142",
    "#4d0187",
    "#feb5ff",
    "#fffbb5",
];
var availableColorsPinterest = [
    "#af43be",
    "#fd8090",
    "#c4ffff",
    "#08deea",
    "#1261d1",
];
var calculateMandlenumber = function (xPosition, yPosition, prevResultX, prevResultY, iterations) {
    var calculatedNumbersX = calculatedNumbers.get(xPosition);
    if (!calculatedNumbersX) {
        calculatedNumbersX = calculatedNumbers.set(xPosition, new Map());
    }
    var calculatedNumber = calculatedNumbersX.get(yPosition);
    if (calculatedNumber) {
        return calculatedNumber;
    }
    var nextResultX = xPosition + prevResultX * prevResultX - prevResultY * prevResultY;
    var nextResultY = yPosition + 2 * prevResultX * prevResultY;
    var magnitude = nextResultX * nextResultX + nextResultY * nextResultY;
    if (magnitude > 50) {
        calculatedNumbersX.set(yPosition, iterations);
        return iterations;
    }
    else if (iterations > 128) {
        calculatedNumbers.set(yPosition, -1);
        return -1;
    }
    else {
        return calculateMandlenumber(xPosition, yPosition, nextResultX, nextResultY, iterations + 1);
    }
};
var getColors = function (xResolution, yResolution, xStepDistance, yStepDistance, centreX, centreY) {
    var colors = [];
    Tone.start();
    Tone.Transport.cancel();
    instrument.releaseAll();
    instrument.sync();
    Tone.Transport.bpm.value = 120;
    Tone.Transport.position = "0:0:0";
    var currentTime = { "16n": 0 };
    for (var i = 0; i < xResolution; i++) {
        var xPosition = centreX + (i - 0.5 * xResolution) * xStepDistance;
        colors.push([]);
        for (var j = 0; j < yResolution; j++) {
            var yPosition = Math.abs(centreY + (j - 0.5 * yResolution) * yStepDistance);
            var mandleNumber = calculateMandlenumber(xPosition, yPosition, 0, 0, 0);
            var mandleNote = {
                pitch: pitchNames[mandleNumber % pitchNames.length],
                durations: [durationNames[mandleNumber % durationNames.length]],
            };
            if (!mandleNote.rest) {
                var holdNoteLength = addDurationObjects({}, mandleNote.durations);
                if (mandleNote.staccato) {
                    if (mandleNote.durations.length === 1 &&
                        (mandleNote.durations[0] === "16n" ||
                            mandleNote.durations[0] === "8n")) {
                        holdNoteLength = "32n";
                    }
                    else {
                        holdNoteLength = "16n";
                    }
                }
                var attackDuration = holdNoteLength;
                instrument.triggerAttackRelease(mandleNote.pitch, attackDuration, currentTime);
            }
            currentTime = addDurationObjects(currentTime, mandleNote.durations);
            Tone.Transport.start();
            if (mandleNumber == -1) {
                colors[i].push("black");
            }
            else {
                colors[i].push(availableColorsPinterest[mandleNumber % availableColorsPinterest.length]);
            }
        }
    }
    console.log("finished calculating colors");
    return colors;
};
var xResolution = 648;
var yResolution = 400;
var centreX = -2.001;
var centreY = 0;
var xStepDistance = 0.001;
var yStepDistance = 0.001;
var colors = getColors(xResolution, yResolution, xStepDistance, yStepDistance, centreX, centreY);
var prevColors = colors.map(function (colorArray) { return colorArray.map(function () { return "#000"; }); });
var recalculateColors = function () {
    colors = getColors(xResolution, yResolution, xStepDistance, yStepDistance, centreX, centreY);
    var canvas = document.getElementById("mandlerrain-canvas");
    var gl = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d", { alpha: false });
    // var gl = canvas?.getContext("webgl");
    // if (gl === null) {
    //   alert(
    //     "Unable to initialize WebGL. Your browser or machine may not support it."
    //   );
    //   return;
    // }
    // // Set clear color to black, fully opaque
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // // Clear the color buffer with specified clear color
    // gl.clear(gl.COLOR_BUFFER_BIT);
    for (var i = 0; i < colors.length; i++) {
        for (var j = 0; j < colors[i].length; j++) {
            if (prevColors[i][j] !== colors[i][j]) {
                gl.fillStyle = colors[i][j];
                gl.fillRect(i, j, 1, 1);
                prevColors[i][j] = colors[i][j];
            }
        }
    }
};
var goUp = function () {
    centreY = centreY - yStepDistance * 32;
    recalculateColors();
};
var goDown = function () {
    centreY = centreY + yStepDistance * 32;
    recalculateColors();
};
var goLeft = function () {
    centreX = centreX - xStepDistance * 32;
    recalculateColors();
};
var goRight = function () {
    centreX = centreX + xStepDistance * 32;
    recalculateColors();
};
var zoomOut = function () {
    xStepDistance = xStepDistance * 2;
    yStepDistance = yStepDistance * 2;
    recalculateColors();
};
var zoomIn = function () {
    xStepDistance = xStepDistance * 0.5;
    yStepDistance = yStepDistance * 0.5;
    recalculateColors();
};
var handleKeypress = function (event) {
    if (event.key === "w") {
        goUp();
    }
    if (event.key === "a") {
        goLeft();
    }
    if (event.key === "s") {
        goDown();
    }
    if (event.key === "d") {
        goRight();
    }
    if (event.key === "q") {
        zoomIn();
    }
    if (event.key === "e") {
        zoomOut();
    }
};

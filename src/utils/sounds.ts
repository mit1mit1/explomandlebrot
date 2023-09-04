import {
  addDurationObjects,
  BaseDuration,
  Note,
  Pitch,
  ToneJSDuration,
} from "./tonejs";

import * as Tone from "tone";
import { getXPosition, getYPosition } from "./grid";
import { instrumentVolume, xResolution, yResolution } from "../constants/params";
import { calculateMandlenumber } from "./math";
import { instrument } from "../";

const quarterDurations: Array<BaseDuration> = [
  // "16n",
  "8n",
  "8n.",
  "4n",
  "4n.",
  "2n",
  "2n.",
  "1n",
  "1n.",
  // "16t",
  // "8t",
  // "4t",
  // "2t",
];

const tritoneScale: Array<Pitch> = [
  "A3",
  // "A#3",
  // "B3",
  "C4",
  // "C#4",
  // "D4",
  "D#4",
  // "E4",
  // "F4",
  "F#4",
  // "G4",
  // "G#4",
  "A4",
  // "A#4",
  // "B4",
  "C5",
  // "C#5",
  // "D5",
  "D#5",
  // "E5",
  // "F5",
  "F#5",
  // "G5",
  // "G#5",
  "A5",
  // "A#5",
  // "B5",
];

const pentatonicScale: Array<Pitch> = [
  // "A3",
  "A#3",
  // "B3",
  // "C4",
  "C#4",
  // "D4",
  "D#4",
  // "E4",
  // "F4",
  "F#4",
  // "G4",
  "G#4",
  // "A4",
  "A#4",
  // "B4",
  // "C5",
  "C#5",
  // "D5",
  "D#5",
  // "E5",
  // "F5",
  "F#5",
  // "G5",
  "G#5",
  // "A5",
  "A#5",
  // "B5",
];

const pushNote = (
  mandleNumber: number,
  currentTime: ToneJSDuration,
  allowAudio: boolean
) => {
  if (allowAudio && instrument.loaded) {
    let mandleNote: Note = {
      pitch: pentatonicScale[Math.abs(mandleNumber) % pentatonicScale.length],
      durations: [
        quarterDurations[Math.abs(mandleNumber) % quarterDurations.length],
      ],
    };
    if (!mandleNote.rest) {
      let holdNoteLength: ToneJSDuration | string = addDurationObjects(
        {},
        mandleNote.durations
      );
      if (mandleNote.staccato) {
        if (
          mandleNote.durations.length === 1 &&
          (mandleNote.durations[0] === "16n" ||
            mandleNote.durations[0] === "8n")
        ) {
          holdNoteLength = "32n";
        } else {
          holdNoteLength = "16n";
        }
      }
      let attackDuration = holdNoteLength;
      instrument.triggerAttackRelease(
        mandleNote.pitch,
        attackDuration,
        currentTime
      );
    }
  }
};

let isTransitioning = false;
const fadeIncrementDb = 1.4;
const fadeIncrementMilliseconds = 90;
const fadeIncrements = 22;

const pushSounds = (
  xStart: number,
  yStart: number,
  iterationsToPush: number,
  getNextX: (
    currentX: number,
    currentY: number,
    currentIteration: number
  ) => number,
  getNextY: (
    currentX: number,
    currentY: number,
    currentIteration: number
  ) => number,
  startTime: ToneJSDuration,
  durationIncrement: BaseDuration,
  calculateDurationIncrease: (
    sinceDifferentNumber: number,
    mandleNumber: number
  ) => number
): ToneJSDuration => {
  let sinceDifferentNumber = 1;
  let prevMandleNumber = -2;
  let currentTime = startTime;
  let currentX = xStart;
  let currentY = yStart;

  for (let i = 0; i < iterationsToPush; i++) {
    let mandleNumber = calculateMandlenumber(currentX, currentY, 0, 0, 0);
    if (mandleNumber != prevMandleNumber) {
      pushNote(mandleNumber, currentTime, true);
      currentTime[durationIncrement] =
        (currentTime[durationIncrement] ?? 0) +
        calculateDurationIncrease(sinceDifferentNumber, mandleNumber);
      sinceDifferentNumber = 1;
      prevMandleNumber = mandleNumber;
    } else {
      sinceDifferentNumber++;
    }
    currentX = getNextX(currentX, currentY, i);
    currentY = getNextY(currentY, currentY, i);
  }
  return currentTime;
};

const fadeOutThenIn = async () => {
  for (let i = 0; i < fadeIncrements; i++) {
    instrument.volume.value = instrument.volume.value - fadeIncrementDb;
    await new Promise((r) => setTimeout(r, fadeIncrementMilliseconds));
  }
  Tone.start();
  instrument.releaseAll();
  Tone.Transport.cancel();
  instrument.sync();
  for (let i = 1; i < fadeIncrements + 1; i++) {
    setTimeout(
      () =>
        (instrument.volume.value = instrument.volume.value + fadeIncrementDb),
      fadeIncrementMilliseconds * i
    );
    if (i === 15) {
      setTimeout(
        () => (isTransitioning = false),
        (fadeIncrementMilliseconds * i) / 2
      );
    }
  }
};

export const getSounds = async (
  xStepDistance: number,
  centreX: number,
  yStepDistance: number,
  centreY: number,
  allowAudio: boolean
) => {
  console.log('getting sounds')
  Tone.Transport.bpm.value = 120;
  Tone.Transport.position = "0:0:0";
  if (allowAudio && !isTransitioning) {
    isTransitioning = true;

    await fadeOutThenIn();
    const startTimeOscillater: ToneJSDuration = { "8n": 1 };
    const startTimeTraverser: ToneJSDuration = { "16n": 1 };
    const startTimeTraverserPlusOne: ToneJSDuration = { "16n": 3 };

    const xCentreSquare = Math.floor(xResolution / 2);
    const yCentreSquare = Math.floor(yResolution / 2);

    const xStartOscillater = xCentreSquare + Math.floor(3 / 5) * (-1) ** 3;
    const yStartOscillater =
      yCentreSquare + Math.floor(3 / 3) * (-1) ** Math.floor(3 / 3);

    const getNextXOscillater = (
      currentX: number,
      currentY: number,
      currentIteration: number
    ) =>
      xCentreSquare +
      Math.floor((currentIteration + 4) / 5) * (-1) ** (currentIteration + 4) * xStepDistance * 4;
    const getNextYOscillater = (
      currentX: number,
      currentY: number,
      currentIteration: number
    ) =>
      yCentreSquare +
      Math.floor((currentIteration + 4) / 3) *
        (-1) ** Math.floor((currentIteration + 4) / 3) * yStepDistance * 4;

    const calculateDurationIncreaseOscillater = (
      sinceDifferentNumberOscillater: number,
      mandleNumberOscillater: number
    ) => sinceDifferentNumberOscillater * ((mandleNumberOscillater % 3) + 1);
    // pushSounds(
    //   xStartOscillater,
    //   yStartOscillater,
    //   xResolution * yResolution,
    //   getNextXOscillater,
    //   getNextYOscillater,
    //   startTimeOscillater,
    //   "16n",
    //   calculateDurationIncreaseOscillater
    // );

    const circleState = {
      xSquare: xCentreSquare,
      ySquare: yCentreSquare,
      xSpeed: 0,
      ySpeed: 1,
      maxX: 0,
      maxY: 0,
      minX: 0,
      minY: 0,
    }

    const turnRight = () => {
      if (circleState.xSpeed == 0) {
        circleState.xSpeed = circleState.ySpeed;
        circleState.ySpeed = 0;
      }
      else if (circleState.ySpeed == 0) {
        circleState.ySpeed = -circleState.xSpeed;
        circleState.xSpeed = 0;
      }
    }


    const getNextXCircler = (
      currentX: number,
      currentY: number,
      currentIteration: number
    ) => {
      circleState.xSquare = (circleState.xSquare + circleState.xSpeed);
      if (circleState.xSquare > circleState.maxX) {
        circleState.maxX = circleState.xSquare;
        turnRight();
      }
      if (circleState.xSquare < circleState.minX) {
        circleState.minX = circleState.xSquare;
        turnRight();
      }
      return getXPosition(circleState.xSquare, xStepDistance, centreX);
    };


    const getNextYCircler = (
      currentX: number,
      currentY: number,
      currentIteration: number
    ) => {
      circleState.ySquare = (circleState.ySquare + circleState.ySpeed);
      if (circleState.ySquare > circleState.maxY) {
        circleState.maxY = circleState.ySquare;
        turnRight();
      }
      if (circleState.ySquare < circleState.minY) {
        circleState.minY = circleState.ySquare;
        turnRight();
      }
      return getYPosition(circleState.ySquare, yStepDistance, centreY);
    };

    const xStartCircler = getNextXCircler(-1, -1, 0);
    const yStartCircler = getNextXCircler(-1, -1, 0);
    const calculateDurationIncreaseCircler = (
      sinceDifferentNumberCircler: number,
      mandleNumberCircler: number
    ) => sinceDifferentNumberCircler;

    //  pushSounds(
    //   xStartCircler,
    //   yStartCircler,
    //   xResolution * yResolution,
    //   getNextXCircler,
    //   getNextYCircler,
    //   startTimeTraverser,
    //   "16n",
    //   calculateDurationIncreaseCircler
    // );


    const getNextXTraverser = (
      currentX: number,
      currentY: number,
      currentIteration: number
    ) => {
      const xSquareTraverser = (xCentreSquare + currentIteration) % xResolution;
      return getXPosition(xSquareTraverser, xStepDistance, centreX);
    };

    const getNextYTraverser = (
      currentX: number,
      currentY: number,
      currentIteration: number
    ) => {
      const ySquareTraverser =
        yCentreSquare + (Math.floor(currentIteration / yResolution) % yResolution);
      return getYPosition(ySquareTraverser, yStepDistance, centreY);
    };

    const xStartTraverser = getNextXTraverser(-1, -1, 0);
    const yStartTraverser = getNextXTraverser(-1, -1, 0);
    const calculateDurationIncreaseTraverser = (
      sinceDifferentNumberTraverser: number,
      mandleNumberTraverser: number
    ) => sinceDifferentNumberTraverser;

    const traverserEndTime = pushSounds(
      xStartTraverser,
      yStartTraverser,
      xResolution * yResolution,
      getNextXTraverser,
      getNextYTraverser,
      startTimeTraverser,
      "16n",
      calculateDurationIncreaseTraverser
    );
    
    // pushSounds(
    //   xStartTraverser,
    //   yStartTraverser,
    //   xResolution * yResolution,
    //   getNextXTraverser,
    //   getNextYTraverser,
    //   startTimeTraverserPlusOne,
    //   "16n",
    //   calculateDurationIncreaseTraverser
    // );

    new Tone.Loop(() => {
      getSounds(
        xStepDistance / 2,
        centreX,
        yStepDistance / 2,
        centreY,
        allowAudio
      );
    }, traverserEndTime).start(traverserEndTime);
    Tone.Transport.start();
  }
};

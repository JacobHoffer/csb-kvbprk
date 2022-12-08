/* eslint-disable no-undef, no-unused-vars */
let freqAtk, freqDec, freqSus, freqRel;
let ampAtk, ampDec, ampSus, ampRel;

let arpSteps = 2;
let arpStepPicker;
let chooseArpNote = [];

let durationPicker;

let oscillatorType;
let osc = new Tone.OmniOscillator("c3", "sine").start();

let ampEnv = new Tone.AmplitudeEnvelope({
  attack: 0.1,
  decay: 0.1,
  sustain: 0.1,
  release: 0.1
});

let filter = new Tone.Filter({
  type: "lowpass"
});

let freqEnv = new Tone.FrequencyEnvelope({
  attack: 0.1,
  decay: 0.1,
  basefrequency: 60,
  octaves: 3.2,
  sustain: 0.1,
  release: 0.1
});

let reverb = new Tone.JCReverb({
  roomSize: 0.8,
  wet: 0.5
});

let dist = new Tone.Distortion({
  distortion: 0.8,
  wet: 0.5
});


let vib = new Tone.Vibrato({
  frequency: 5,
	depth: 0.2,
	type: "sine",
  wet: 1
});

let bitty = new Tone.BitCrusher({
  bits: 16,
  wet: 0.5
});

filter.toDestination();
reverb.connect(filter);
vib.connect(reverb);
ampEnv.connect(vib);
bitty.connect(ampEnv)
dist.connect(bitty);
osc.connect(dist);

freqEnv.connect(filter.frequency);

// Control with p5 keys
// Then add the AudioKeys keyboard

// create a keyboard
const keyboard = new AudioKeys();

keyboard.down(function (note) {
  // do things with the note object
  osc.frequency.value = note.frequency;
  ampEnv.triggerAttack();
  freqEnv.triggerAttack();

  console.log(note);

  let values = [];

  for (let i = 0; i < chooseArpNote.length; i++) {
    values.push(chooseArpNote[i].value());
  }

  let freqValues = [];

  values.forEach((value) => {
    freqValues.push(
      Tone.Frequency(value, "midi").toFrequency() + note.frequency
    );
  });

  let segTime = duration / values.length;

  for (let j = 0; j < 50; j++) {
    freqValues.forEach((note, i) => {
      osc.frequency.setValueAtTime(
        note,
        Tone.now() + i * segTime + j * duration
      );
    });
  }
});

keyboard.up(function (note) {
  ampEnv.triggerRelease();
  freqEnv.triggerRelease();
  // do things with the note object
});

function preload() {
  img = loadImage("media/asskeys.jpeg");
  img2 = loadImage("media/GLOVER.jpeg");
}

function setup() {
  startContext();

  createCanvas(1100, 800);

  oscillatorType = createSelect();
  oscillatorType.position(80, 125);
  oscillatorType.option("sine");
  oscillatorType.option("square");
  oscillatorType.option("triangle");
  oscillatorType.option("sawtooth");
  oscillatorType.option("pwm");
  oscillatorType.selected("sine");

  pwmText = createSpan(`MOD`);
  pwmText.position(158, 150);
  pwmText.style("font-family", "helvetica");
  pwmText.hide();

  oscillatorType.changed(() => {
    osc.type = oscillatorType.value();

    if (oscillatorType.value() === "pwm") {
      modulationFrequency.show();
      pwmText.show();
      console.log(pwmText);
    } else {
      modulationFrequency.hide();
      pwmText.hide();
    }
  });

  vibSlider = createSlider(0, 1, 0, 0);
  vibSlider.position(610, 300);
  vibSlider.style("width", "150px");

  bitSlider = createSlider(1, 16, 16, 1);
  bitSlider.position(320, 325);
  bitSlider.style("width", "150px");

  distSlider = createSlider(-1, 1, 0, 0);
  distSlider.position(320, 300);
  distSlider.style("width", "150px");

  distMixSlider = createSlider(0, 1, 0.5, 0);
  distMixSlider.position(320, 350);
  distMixSlider.style("width", "150px");

  wetSlider = createSlider(0, 1, 0.5, 0);
  wetSlider.position(30, 300);
  wetSlider.style("width", "150px");

  roomSlider = createSlider(0, 1, 0.5, 0);
  roomSlider.position(30, 350);
  roomSlider.style("width", "150px");

  modulationFrequency = createSlider(0, 5, 0.5, 0);
  modulationFrequency.position(80, 150);
  modulationFrequency.hide();
  modulationFrequency.style("width", "75px");

  ampAtk = createSlider(0.1, 3, 0.1, 0);
  ampAtk.position(320, 70);
  ampAtk.style("width", "150px");

  ampDec = createSlider(0.1, 3, 0.1, 0);
  ampDec.position(320, 110);
  ampDec.style("width", "150px");

  ampSus = createSlider(0, 1, 0.01, 0);
  ampSus.position(320, 150);
  ampSus.style("width", "150px");

  ampRel = createSlider(0.1, 3, 0.01, 0);
  ampRel.position(320, 190);
  ampRel.style("width", "150px");

  freqAtk = createSlider(0.1, 3, 0.1, 0);
  freqAtk.position(610, 70);
  freqAtk.style("width", "150px");

  freqDec = createSlider(0.1, 3, 0.1, 0);
  freqDec.position(610, 110);
  freqDec.style("width", "150px");

  freqSus = createSlider(0, 1, 0.01, 0);
  freqSus.position(610, 150);
  freqSus.style("width", "150px");

  freqRel = createSlider(0.1, 3, 0.1, 0);
  freqRel.position(610, 190);
  freqRel.style("width", "150px");

  arpStepPicker = createSelect();
  arpStepPicker.position(980, 20);
  arpStepPicker.option(1);
  arpStepPicker.option(2);
  arpStepPicker.option(3);
  arpStepPicker.option(4);
  arpStepPicker.option(5);
  arpStepPicker.option(6);
  arpStepPicker.option(7);
  arpStepPicker.option(8);
  arpStepPicker.option(9);

  durationPicker = createSelect();
  durationPicker.position(930, 20);
  durationPicker.option(0.1);
  durationPicker.option(0.5);
  durationPicker.option(1);
  durationPicker.option(4);

  durationPicker.changed(() => {
    duration = durationPicker.value();
  });

  arpStepPicker.changed(() => {
    arpSteps = arpStepPicker.value();

    let sliders = selectAll(".arp-sliders");
    sliders.forEach((slider) => slider.remove());
    chooseArpNote = [];
    for (let i = 0; i < arpSteps; i++) {
      chooseArpNote.push(createSlider(50, 75, 60, 1));
      chooseArpNote[i].position(905, 40 + i * 20);
      chooseArpNote[i].class("arp-sliders");
    }
  });
}

function draw() {
  background("magenta");
  if (oscillatorType.value() === "pwm") {
    osc.modulationFrequency.value = modulationFrequency.value();
  }

  image(img, 0, 400, 1100, 400);
  image(img2, 870, 20, 200, 200);

  fill(170);
  rect(30, 20, 200, 200);

  fill("red");
  rect(30, 20, 200, 50);
  fill("black");
  textSize(25);
  text("Oscillator", 75, 55);

  fill(170);
  rect(30, 230, 200, 168);

  fill("yellow");
  rect(30, 230, 200, 50);
  fill("black");
  textSize(25);
  text("Fruity Verb", 70, 265);
  textSize(11);
  text("Wetness", 185, 315);
  textSize(9);
  text("Room Size", 185, 365);

  fill(170);
  rect(320, 20, 200, 200);
  fill("black");
  textSize(11);
  text("Attack", 475, 85);
  text("Decay", 475, 125);
  text("Sustain", 475, 165);
  text("Release", 475, 205);

  fill("green");
  rect(320, 20, 200, 50);
  textSize(25);
  fill("black");
  text("Amp Envelope", 340, 55);

  fill(170);
  rect(610, 20, 200, 200);
  fill("black");
  textSize(11);
  text("Attack", 765, 85);
  text("Decay", 765, 125);
  text("Sustain", 765, 165);
  text("Release", 765, 205);

  fill(170);
  rect(320, 230, 200, 168);

  fill("brown");
  rect(320, 230, 200, 50);
  fill("black");
  textSize(25);
  text("Fruity Dist", 360, 265);
  textSize(11);
  text("Distort", 475, 315);
  textSize(11);
  text("Mix", 475, 365);
  text("Bits", 475, 340);

  fill("orange");
  rect(610, 20, 200, 50);
  textSize(25);
  fill("black");
  text("Freq Envelope", 630, 55);

  fill(170);
  rect(610, 230, 200, 168);

  fill("pink");
  rect(610, 230, 200, 50);
  textSize(25);
  fill("black");
  text("Vibrato", 670, 265);
  textSize(11);
  text("Vibrate", 765, 315);

  ampEnv.attack = ampAtk.value();
  ampEnv.decay = ampDec.value();
  ampEnv.sustain = ampSus.value();
  ampEnv.release = ampRel.value();

  freqEnv.attack = freqAtk.value();
  freqEnv.decay = freqDec.value();
  freqEnv.sustain = freqSus.value();
  freqEnv.release = freqRel.value();

  reverb.roomSize.value = roomSlider.value();
  reverb.wet.value = wetSlider.value();

  dist.distortion.value = distSlider.value();
  dist.wet.value = distMixSlider.value();

  vib.wet.value = vibSlider.value();

  bitty.bits.value = bitSlider.value();
  bitty.wet.value = distMixSlider.value();
}

//function keyPressed() {
/*.triggerAttackRelease() method tells the oscillator to
    to set its frequency to the pitch passed in as the first argument,
    and to open its envelope for the duration passed in as the
    second argument. The envelope closes after that.
  */
// synth.triggerAttackRelease("g5", 1);

function startContext() {
  console.log("Tone is: ", Tone.context.state);
  document.body.addEventListener("click", () => {
    Tone.context.resume();
    console.log("Tone is: ", Tone.context.state);
  });
}

/**
 * Created by Jonny on 12/14/2014.
 */

var audioCtx;
var htmlAudio;
var source;
var dataArray;
var bufferLength;
var analyser;
var distortion;
var gainNode;
var biquadFilter;
var convolver;
var canvas;
var canvasCtx;
var color1;

$(document).ready( function() {
    init();

    htmlAudio.addEventListener("canplay", function(e) {
        setupAudioNodes();
    }, false);

    console.log("Set event listener.");
});

/*
 *	Initializes all contexts, variables, canvas', etc.
 **/
function init() {
    navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    htmlAudio = document.querySelector('audio');

    analyser = audioCtx.createAnalyser();
    analyser.smoothingTimeConstant = 0.85;
    distortion = audioCtx.createWaveShaper();
    gainNode = audioCtx.createGain();
    biquadFilter = audioCtx.createBiquadFilter();
    convolver = audioCtx.createConvolver();

    canvas = document.querySelector('#visualizer');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasCtx = canvas.getContext('2d');

    color1 = "#" + ((1 << 24) * Math.random() | 0).toString(16);
}

/*
 *  Initializes all of the audio nodes that are used.
 **/
function setupAudioNodes() {
    source = audioCtx.createMediaElementSource(htmlAudio);

    htmlAudio.play();

    source.connect(analyser);
    analyser.connect(distortion);
    distortion.connect(audioCtx.destination);

    console.log("Set audio nodes.");

    visualize();
}

/*
 *  Visualize is where all of the draw() functions are called & all of the
 *  rendering is done.
 **/
function visualize() {
    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(dataArray);
    console.log(bufferLength);

    draw();
    console.log("Visualizer called.")
}

/*
 *  Draw to the canvas.
 **/
function draw() {
    drawVisual = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.fillStyle = color1;
    bars = 600;

    for (var i = 0; i < bars; i++) {

        bar_x = i * 5;
        bar_width = 2;
        bar_height = -(dataArray[i] * 2);

        canvasCtx.fillRect(bar_x, HEIGHT, bar_width, bar_height);
    }
}
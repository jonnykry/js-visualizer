/**
 * Created by @jonnykry
 * Basic wave visualization model.
 * Based off the AnalyserNode tutorial:  https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
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
    analyser.smoothingTimeConstant = 0.5;
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

    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(200, 200, 200)';

    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;

    for(var i = 0; i < bufferLength; i+=0.25) {

        var v = dataArray[i] / 240.0;
        var y = v * HEIGHT;

        if(i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();

}
var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var audioCtx = new AudioContext();
var micInput = null;
var processor = null;
var recording = false;
var bitBuffer = null;
var inputBuffer_LEFT = null;
var client = new BinaryClient('ws://140.113.155.188:9001');

client.on('open', function() {
  window.Stream = client.createStream();
});

if (!navigator.getUserMedia) {
  navigator.getUserMedia = 
    navigator.getUserMedia || 
    navigator.webkitGetUserMedia || 
    navigator.mozGetUserMedia;
}

if(navigator.getUserMedia) {
  var session = {
    audio: true,
    video: false
  };
  navigator.getUserMedia(session, initStream, function(e){
    console.log('audio capturing error:' + e.name);
  });
}else {
  console.log('Sorry~ the browser can\'t load the getUserMedia service... ');
}

function initStream(stream) {
  var bufferSize = 2048;
  micInput = audioCtx.createMediaStreamSource(stream);
  processor = audioCtx.createScriptProcessor(bufferSize, 1, 1);  
  micInput.connect(processor);
  processor.connect(audioCtx.destination); 
  micInput.connect(audioCtx.destination);
}

function convertoFloat32ToInt16(buffer) {
  var length = buffer.length;
  var newbuffer = new Int16Array(length);
  while (length--) {
    newbuffer[length] = Math.min(1, buffer[length]) * 0x7FFF;    //convert to 16 bit
  }
  return newbuffer.buffer;
}

//Here get the PCM data in input left channel.
function recorderProcess(audioProcessingEvent) {
  inputBuffer_LEFT = audioProcessingEvent.inputBuffer.getChannelData(0);
  //bitBuffer = convertoFloat32ToInt16(inputBuffer_LEFT);
  window.Stream.write(inputBuffer_LEFT);
}

window.startR = function() {
  recording = true;
  processor.onaudioprocess = recorderProcess;
  console.log ('recording: ' + recording);
  
}

window.stopR = function() {
    recording = false;
    console.log ('recording: ' + recording);
    micInput.disconnect(processor);
    processor.disconnect(audioCtx.destination);
    micInput.disconnect(audioCtx.destination);
    console.log(bitBuffer);
}
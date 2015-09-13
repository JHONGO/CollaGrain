(function(window) {

  //set the binary socket sending direction IP  and port.  
  var client = new BinaryClient('ws://140.113.155.188:9001');

  client.on('open', function() {
    //Create a stream for sending the audio PCM data when binary connection established.
    window.Stream = client.createStream();

    //Capture the Microphone service with getUserMedia.
    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {audio:true}, 
        initStream, 
        function(e) {
          alert('Error occured on capturing microphone audio.');
        }
      );
    } 
    else {
      alert('[getUserMedia] service is not supported in your browser.');
    }


    var recording = false;
    var loadTimes = 0;
    var start;
    var end;
    document.getElementById('status').innerHTML = 'Click Record Button';   

    window.startRecording = function() {
      //record length counting start.
      start = new Date();

      loadTimes++;
      if(loadTimes == 2){       
        location.reload();
        loadTimes = 0;
      }else {
        recording = true;
        document.getElementById('status').innerHTML = 'It\'s now recording.';
      }
    }


    window.stopRecording = function() {
      //record length counting stop, and measure the record length.
      end = new Date();
      recordingLength = end - start;
      recording = false;
      document.getElementById('status').innerHTML = 'Recording Stopped.\<br\>' + 'Length: \<span style=\"color:#F00; font-size:35px;\"\>' + recordingLength + '<\/span> ms.';
      

      //stop write the stream.
      window.Stream.end();
    }


    AudioContext = window.AudioContext || window.webkitAudioContext;
    window.audioCtx = new AudioContext();
    window.analyser = audioCtx.createAnalyser(); 
    

    function initStream(stream) {
      var bufferSize = 2048;
      var gain = audioCtx.createGain();
      gain.gain.value = 0.8;
      Input = audioCtx.createMediaStreamSource(stream);      
      processor = audioCtx.createScriptProcessor(bufferSize, 1, 1);
      
      processor.onaudioprocess = function(audioProcessEvent){
        if(!recording) return;
        console.log ('recording');
        
        //Measure the current record length.
        var cur_end = new Date();
        cur_leng = cur_end - start;
        document.getElementById('status').innerHTML = 'Recording Stopped.\<br\>' + 'Length: \<span style=\"color:#F00; font-size:35px;\"\>' + cur_leng + '<\/span> ms.';

        //When audio stream flows into the ScriptProcessorNode, the on audioprocess event will 
        //convert audio samples from default Float32 to Int16 format, and then send to the server.
        var input1 = audioProcessEvent.inputBuffer.getChannelData(0);
        window.Stream.write(convertoFloat32ToInt16(input1));
      }

      //AudioCtx Connection
      Input.connect(processor);
      Input.connect(gain);
      gain.connect(analyser);
      processor.connect(audioCtx.destination); 
    }

    function convertoFloat32ToInt16(buffer) {
      var length = buffer.length;
      var newbuf = new Int16Array(length)

      while (length--) {
        newbuf[length] = buffer[length]*0xFFFF;    //convert to 16 bit
      }
      return newbuf.buffer;
    }

  });
})(this);

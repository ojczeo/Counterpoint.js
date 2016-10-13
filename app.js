var ctx = new window.webkitAudioContext || new window.AudioContext;
    
    //takes in formatted array, determines hertz, sustain, and octave, and sends to main play function 
    function sendNotesToPlay(index, id) {
        var arr = stringParser(id);
        
        if (arr.length > index) {
        
          if (index === 1) {
           play(noteHz(arr[index -1][0]), noteDuration(arr[index -1][1]), whichOctave(arr[index -1][2]));
          }
          
        setTimeout(function() {
          var octave = whichOctave(arr[index][2]);
          var sustain = noteDuration(arr[index][1]);
          var hertz = noteHz(arr[index][0]);
          play(hertz, sustain, octave);
          sendNotesToPlay(++index, id);
        }, 1000 * noteDuration(arr[index][1]))
      }
    }
    
    //gets input string and formats it into array of arrays to send to sendNotesToPlay function
    function stringParser(id) {
      var noteString = document.getElementById(id).value.toLowerCase();  
      if (noteString.length !== 0) {
        var noteArr =  noteString.match(/([a-g,r]+#|[a-g,r])([whqos])(\d)/g); 
        var finalArr = noteArr.map(makeArrInArr);
      
        function makeArrInArr(item) {
          if (item.length === 4) {
            var arr = [];
            arr.push(item.slice(0,2));
            arr.push(item.slice(2,3));
            arr.push(item.slice(3,4));
            return arr;
          } 
          
          if (item.length === 3) {
            var arr = [];
            arr.push(item.slice(0,1));
            arr.push(item.slice(1,2));
            arr.push(item.slice(2,3));
            return arr;
          }
        }
        return finalArr;
      }
      
      else {
        return 1;
      }
      // expected input ex: 'co1d#s4fw2', etc
      // expected output [[c,o,1],[d#,s,4],[f,w,2]], etc
    }
    
    //dertermines note duration
    function noteDuration(char) {
      var duration = char;
      var sustain;      
       if (duration === "w")
      sustain = 4
      
      if (duration === "h")
      sustain = 2
      
      if (duration === "q")
      sustain = 1
    
      if (duration === "o")
      sustain = .5
      
      if (duration === "s")
      sustain = .25
      
      return sustain;
    }
    
    //determines frequency
    function noteHz(note){
      var note = note;
      var frequencies = {
       	'c': 130.81,
       	'c#': 139.00,
       	'd': 146.83,
       	'd#': 156.00,
       	'e': 164.81,
       	'f': 174.61,
       	'f#': 185.00,
       	'g': 196.00,
       	'g#': 208.00,
       	'a': 220.00,
       	'a#': 233.00,
       	'b': 246.94,
       	'r': 0.0,
       	};
       	
       	var hertz = frequencies[note];
       	return hertz;
    }
    
    //determines octave number
    function whichOctave(num) {
      if (num === 1)
      return num;
      
      else
      return Math.pow(2, num -1);
    }
    
    //main sound generating function.  Receives attributes and creates appropriate note
    function play(hertz, sustain, octave) {
      console.log("I Played!!!: " + hertz + sustain + octave);
      var osc = ctx.createOscillator();
      var gainNode = ctx.createGain();
      
      osc.type = document.getElementById('wav-type').value;     
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      gainNode.gain.value = 0.0;
      gainNode.gain.setTargetAtTime(.75, ctx.currentTime, 0.1);
      gainNode.gain.setTargetAtTime(0.0, ctx.currentTime + sustain, 0.01)
      osc.frequency.value = hertz * octave / 4;
      osc.start();
      osc.stop(ctx.currentTime + sustain + .01);
    }
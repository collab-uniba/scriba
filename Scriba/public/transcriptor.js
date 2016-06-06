var final_transcript = '';
var recognizing = false;

var socket = io.connect('http://collab.di.uniba.it:48922');//"http://collab.di.uniba.it/~iaffaldano:48922"

if ('webkitSpeechRecognition' in window) {

	var recognition = new webkitSpeechRecognition();

	recognition.continuous = true;
	recognition.interimResults = true;

	recognition.onstart = function () {
		recognizing = true;
		log_span.innerHTML += "RECOGNITION STARTED";
	};

	recognition.onerror = function (event) {
		console.log(event.error);
		log_span.innerHTML += "RECOGNITION ERROR";
	};

	recognition.onend = function () {
		log_span.innerHTML += "RECOGNITION STOPPED";
		if(recognizing){
			recognition.start();
			log_span.innerHTML += "RECOGNITION RESTARTED";
		}
		
	};

	recognition.onresult = function (event) {
		var interim_transcript = '';
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				final_transcript += event.results[i][0].transcript;
				//recognition.stop();
				//recognition.start();
				socket.emit('client_message', {text: event.results[i][0].transcript});
			} else {
				interim_transcript += event.results[i][0].transcript;
			}
		}
		final_transcript = capitalize(final_transcript);
		final_span.innerHTML = linebreak(final_transcript);
		interim_span.innerHTML = linebreak(interim_transcript);
	};
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
	return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

function capitalize(s) {
	return s.replace(s.substr(0, 1), function (m) {
		return m.toUpperCase();
	});
}

function startDictation(event) {
	if (recognizing) {
		recognition.stop();
		recognizing=false;
		start_button.innerHTML = "START"
		return;
	}
	final_transcript = '';
	recognition.lang = 'it-IT';
	recognition.start();
	start_button.innerHTML = "STOP"
	final_span.innerHTML = '';
	interim_span.innerHTML = '';
}
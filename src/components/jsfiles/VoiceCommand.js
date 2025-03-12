import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '../stylefiles/VoiceCommand.css';

const VoiceCommand = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const wakeWord = 'hello';

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert('Your browser does not support Speech Recognition. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [isListening]);

  useEffect(() => {
    if (transcript.toLowerCase().includes(wakeWord)) {
      setIsListening(true);
      resetTranscript();
    } else if (isListening && transcript) {
      setTimeout(() => {
        setIsListening(false);
        resetTranscript();
      }, 2000);
    }
  }, [transcript, isListening, resetTranscript]);

  return (
    <div className="container">
      <div className={`ball ${isListening ? 'listening' : 'idle'}`}></div>
      <p className="recognized-text">{isListening ? transcript : ''}</p>
    </div>
  );
};

export default VoiceCommand;

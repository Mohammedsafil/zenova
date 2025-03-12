import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '../stylefiles/VoiceCommand.css';

const VoiceCommand = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [wakeWord, setWakeWord] = useState('');
  const [assistantName, setAssistantName] = useState('');

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
    if (transcript.toLowerCase().includes(wakeWord.toLowerCase())) {
      setIsListening(true);
      resetTranscript();
    } else if (isListening && transcript) {
      setTimeout(() => {
        setIsListening(false);
        resetTranscript();
      }, 2000);
    }
  }, [transcript, isListening, wakeWord, resetTranscript]);

  return (
    <div className="container">
      {!assistantName ? (
        <div className="setup">
          <h2>Name your Assistant</h2>
          <input 
            type="text" 
            placeholder="Enter assistant name" 
            value={wakeWord} 
            onChange={(e) => setWakeWord(e.target.value)} 
          />
          <button onClick={() => setAssistantName(wakeWord)}>Set Name</button>
        </div>
      ) : (
        <>
          <h2>Say "{assistantName}" to activate</h2>
          <div className={`ball ${isListening ? 'listening' : 'idle'}`}></div>
          <p className="recognized-text">{isListening ? transcript : ''}</p>
        </>
      )}
    </div>
  );
};

export default VoiceCommand;

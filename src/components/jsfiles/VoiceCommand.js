import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import '../stylefiles/VoiceCommand.css';

const VoiceCommand = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [wakeWord, setWakeWord] = useState('');
  const [assistantName, setAssistantName] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [commandCode, setCommandCode] = useState('');

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert('Your browser does not support Speech Recognition. Please use Chrome or Edge.');
      return;
    }
    SpeechRecognition.startListening({ continuous: true });
  }, []);

  useEffect(() => {
    const lowerTranscript = transcript.toLowerCase();
    const lowerWakeWord = wakeWord.toLowerCase();

    if (lowerWakeWord && lowerTranscript.includes(lowerWakeWord)) {
      const index = lowerTranscript.indexOf(lowerWakeWord);
      if (index !== -1) {
        console.log(transcript)
        const commandText = transcript.substring(index + wakeWord.length).trim();
        if (commandText) {
          setUserMessage(commandText);  // Store the command
          sendMessageToAPI(commandText);
          resetTranscript();  // Reset only AFTER processing
        }
      }
    }
  }, [transcript, wakeWord]);

  const sendMessageToAPI = async (message) => {
    if (message.length < 1 || message.length > 100) {
      setCommandCode("Invalid input length");
      return;
    }
    try {
      const { data } = await axios.post("https://zenova-server.onrender.com/fackPutReq", {
        message,
      }, {
        headers: { "Content-Type": "application/json" }
      });

      // Extract only the command code from the response
      const extractedCode = data.match(/\d+/g)?.[0] || "No Code Found";
      setCommandCode(extractedCode);

    } catch (error) {
      if (error.response) {
        setCommandCode(error.response.data.includes("Access Denied") ? "Access Denied" : "Error");
      } else {
        setCommandCode("Network Error");
      }
    }
  };

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
          <h2>Say "{assistantName}" in your sentence</h2>
          <div className={`ball listening`}></div>
          <p className="recognized-text">{userMessage}</p>
          {commandCode && <p className="response-text">Command Code: {commandCode}</p>}
        </>
      )}
    </div>

};

export default VoiceCommand;

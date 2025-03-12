import React, { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";
import "../stylefiles/VoiceCommand.css";

const VoiceCommand = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [wakeWord, setWakeWord] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [isListening]);

  useEffect(() => {
    if (wakeWord && transcript.toLowerCase().includes(wakeWord.toLowerCase())) {
      setIsListening(true);
      resetTranscript();
    } else if (isListening && transcript) {
      setTimeout(() => {
        setUserMessage(transcript);
        sendMessageToAPI(transcript);
        setIsListening(false);
        resetTranscript();
      }, 2000);
    }
  }, [transcript, isListening, wakeWord, resetTranscript]);

  const sendMessageToAPI = async (message) => {
    if (message.length < 1 || message.length > 100) {
      setResponse("Invalid input length");
      return;
    }
    try {
      const { data } = await axios.post("https://zenova-server.onrender.com/fackPutReq", {
        message,
      }, {
        headers: { "Content-Type": "application/json" }
      });

      setResponse(data);
    } catch (error) {
      if (error.response) {
        setResponse(error.response.data || "Error sending message");
      } else {
        setResponse("Network Error");
      }
    }
  };

  return (
    <div className="container">
      {!wakeWord ? (
        <div>
          <input
            type="text"
            placeholder="Name your assistant..."
            onChange={(e) => setWakeWord(e.target.value)}
          />
          <button onClick={() => setIsListening(true)}>Start Listening</button>
        </div>
      ) : (
        <>
          <div className={`ball ${isListening ? "listening" : "idle"}`}></div>
          <p className="recognized-text">{isListening ? transcript : userMessage}</p>
          {response && <p className="response-text">{response}</p>}
        </>
      )}
    </div>
  );
};

export default VoiceCommand;

import './App.css';
import Home from './components/jsfiles/Home';
import VoiceCommand from './components/jsfiles/VoiceCommand';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/jsfiles/Navbar';

function App() {
  

  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="" element={<Home/>} />
        <Route path="/get-started" element={<VoiceCommand/>} />
      </Routes>
    </Router>
  );
}

export default App;

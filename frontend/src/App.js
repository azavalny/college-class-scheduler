import './App.css';
import { Routes, Route } from 'react-router-dom';
import Index from './components/Index';
import About from './components/About';
import Instructions from './components/Instructions';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;

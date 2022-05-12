import './App.css';
import { Routes, Route } from 'react-router-dom';
import Index from './components/Index';
import About from './components/About';
import ReportBug from './components/ReportBug';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
      {/*<Route path="/report-bug" element={<ReportBug />} />*/}
      </Routes>
    </div>
  );
}

export default App;

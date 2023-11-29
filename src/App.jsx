import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Questionario from './components/Questionario';
import Home from './components/Home';


function App() {
  return (
    <div>
      <Router>
        <h1>Titulo</h1>
        <Navbar />
        <Routes>
          <Route path='Home' element={<Home />} />
          <Route path="/Questionario" element={<Questionario />} />
        </Routes>

      </Router>
    </div>
  );
}

export default App;

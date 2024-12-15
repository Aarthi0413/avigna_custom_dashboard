import React from 'react';
import './index.css';
import Dashboard from './components/Dashboard';
import AnimatedBackground from './components/AnimatedBackground';


function App() {
  return (
    <div className='px-3 py-1 font-mono relative'>
      <AnimatedBackground/>
      <Dashboard/>
    </div>
  );
}

export default App;

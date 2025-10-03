// App.tsx
import React from 'react';
import { BrowserRouter as Router,  Routes } from 'react-router-dom';
import { useKeepAlive } from './components/useKeepAlive.tsx';


const App: React.FC = () => {
  useKeepAlive(); // Initialize the keep-alive pinging
  return (
    <Router>
      <Routes>
    
      </Routes>
    </Router>
  );
};

export default App;

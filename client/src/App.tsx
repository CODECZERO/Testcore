// App.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import "./App.css";
import Login from './components/SignUp.jsx';//
import SignIn from './components/SignIn.js';

const App: React.FC = () => {
  return(
    <>
      <Login/>
      <SignIn/>
    </>
  )
  
};

export default App;
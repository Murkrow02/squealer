import logo from './logo.svg';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React, { useState, useEffect } from 'react';
import NewSqueal from "./pages/NewSqueal";
import Feed from "./pages/Feed";
function App() {


  return (
      <div>
          <NewSqueal/>
      </div>
  );
}

export default App;

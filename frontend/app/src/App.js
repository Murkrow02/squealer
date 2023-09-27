import logo from './logo.svg';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React, { useState, useEffect } from 'react';
import NewSqueal from "./pages/NewSqueal";
function App() {

    const [squeals, setSqueals] = useState([]);
    useEffect(() => {
        window.getAllSqueals().then((response) =>{
            setSqueals(response.data)
        });
    },[]);

  return (
      <div>
        <NewSqueal/>
          <div>
              {squeals.map((squeal) => (
                  <div>
                      <p>{squeal.content}</p>
                  </div>
              ))}
          </div>
      </div>
  );
}

export default App;

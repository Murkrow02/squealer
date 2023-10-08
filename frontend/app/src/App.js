import logo from './logo.svg';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React, { useState, useEffect } from 'react';
import NewSqueal from "./pages/NewSqueal";
import Feed from "./pages/Feed";
import Channel from "./pages/Channel";
import Profile from "./pages/Profile";
function App() {

    return (
      <div>

          {/*
          CHANNEL USAGE
          <Channel muted={true} subscribed={true}/>
          */
          /*
          PROFILE USAGE
           <Profile karma={int} hasSMM={true}/>
          */
          }
          <Profile type={"pro"} karma={123} hasSMM={false}/>
      </div>
    );
}

export default App;

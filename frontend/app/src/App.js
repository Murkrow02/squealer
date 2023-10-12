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
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box";
function App() {


    const [value, setValue] = React.useState(0);
    const ref = React.useRef(null);



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
          { value === 0  ?
                <Feed/>
            : value === 1 ?
                <NewSqueal/>
            : value === 2 ?
                <Profile type={"pro"} karma={123} hasSMM={false}/>
            : null
          }


          <Box sx={{ pb: 7 }} ref={ref}>
              <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                  <BottomNavigation
                      showLabels
                      value={value}
                      onChange={(event, newValue) => {
                          setValue(newValue);
                      }}
                  >
                      <BottomNavigationAction label="Feed" icon={<DynamicFeedIcon />} />
                      <BottomNavigationAction label="New Squeal" icon={<AddIcon />} />
                      <BottomNavigationAction label="Profile" icon={<AssignmentIndIcon />} />
                  </BottomNavigation>
              </Paper>
          </Box>
      </div>
    );
}

export default App;

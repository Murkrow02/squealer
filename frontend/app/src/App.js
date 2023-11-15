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
    const [isLoading, setIsLoading] = React.useState(true);
    const [profileType, setProfileType] = React.useState("guest");
    const ref = React.useRef(null);

    useEffect(() => {
        window.getProfile().then((response) =>{
            console.log("profile");
            console.log(response.data);
            setProfileType(response.data.type);
            setIsLoading(false);
        });
    });

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


          {
              !isLoading ?
                  <>
                      {
                          profileType !== "guest" ?
                              value === 0  ?
                                  <Feed/>
                              : value === 1 ?
                                  <NewSqueal/>
                              : value === 2 ?
                                  <Profile type={profileType} karma={123} hasSMM={false}/>
                              : null
                          :
                              value === 0  ?
                                  <Feed/>
                              : value === 2 ?
                                  <Profile type={profileType} karma={0} hasSMM={false}/>
                              : null
                      }
                      <Box sx={{ pb: 7 }} ref={ref}>
                          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                              <BottomNavigation
                                  showLabels
                                  value={value}
                                  onChange={(event, newValue) => {
                                      console.log(newValue);
                                      setValue(newValue);
                                  }}>
                                  <BottomNavigationAction label="Feed" icon={<DynamicFeedIcon />} />
                                  {
                                      profileType !== "guest" ?
                                          <BottomNavigationAction label="New Squeal" icon={<AddIcon />} />
                                      : null
                                  }
                                  <BottomNavigationAction label="Profile" icon={<AssignmentIndIcon />} />
                              </BottomNavigation>
                          </Paper>
                      </Box>
                  </>
              : null

          }


      </div>
    );
}

export default App;

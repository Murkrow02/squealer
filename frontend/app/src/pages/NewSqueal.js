import React, { useState, useEffect } from 'react';
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";

function NewSqueal() {
    return (
        <body>
            <header style={{position:'fixed', top:'0', zIndex:'1', backgroundColor:'white'}}>
                <nav style={{ width:'100vw', padding: '20px 0', borderBottom: 'solid 2px #aaaaaa'}}>
                    <h1 style={{margin: '0', textAlign:'center'}}>New Squeal</h1>
                </nav>
            </header>
            <FormControl style={{marginTop:'10vh', width:'100%'}}>
                <FormLabel style={{textAlign:'center'}} id="demo-row-radio-buttons-group-label">Squeal type</FormLabel>
                <RadioGroup
                    row
                    style={{justifyContent:'center'}}
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    defaultValue="text"
                    name="row-radio-buttons-group"
                >
                    <FormControlLabel value="text" control={<Radio />} label="Text" />
                    <FormControlLabel value="image" control={<Radio />} label="Image" />
                    <FormControlLabel value="location" control={<Radio />} label="Location" />
                </RadioGroup>
            </FormControl>
        </body>
    );
}

export default NewSqueal;
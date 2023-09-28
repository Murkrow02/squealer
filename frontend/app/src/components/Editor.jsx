import * as React from 'react';
import { useState, useEffect } from 'react';
import {Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, styled, TextField} from "@mui/material";
import * as PropTypes from "prop-types";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

VisuallyHiddenInput.propTypes = {type: PropTypes.string};
export default function Editor(props) {

    //Chars left
    const [maxDayChars, setMaxDayChars] = React.useState(props.day_max);
    const initialDayChars = props.day_max;
    const [maxWeekChars, setMaxWeekChars] = React.useState(props.week_max);
    const initialWeekChars = props.week_max;
    const [maxMonthChars, setMaxMonthChars] = React.useState(props.month_max);
    const initialMonthChars = props.month_max;

    //Squeal type
    const [squealType, setSquealType] = React.useState("text");


    function handleSquealTextChange(event) {

        //check if squeal type is text
        if (squealType !== "text") {
            return;
        }

        if ((initialDayChars - event.target.value.length) < 0 || (initialWeekChars - event.target.value.length) < 0 || (initialMonthChars - event.target.value.length) < 0) {
            //remove last character from text
            event.target.value = event.target.value.slice(0, -1)
            alert("You have reached the maximum number of characters for this squeal type.");
            return;
        }

        setMaxDayChars(initialDayChars - event.target.value.length)
        setMaxWeekChars(initialWeekChars - event.target.value.length)
        setMaxMonthChars(initialMonthChars - event.target.value.length)

    }

    //handle radio button change
    function handleSquealTypeChange(event) {
        setSquealType(event.target.value);

        if (event.target.value !== "text") {

            //reset char count
            setMaxDayChars(initialDayChars);
            setMaxWeekChars(initialWeekChars);
            setMaxMonthChars(initialMonthChars);

            //dim char count
            document.getElementById("chars-count-container").style.opacity = "0.5";
        } else {
            //bright char count
            document.getElementById("chars-count-container").style.opacity = "1";
        }
    }

    return(
        <div style={{padding: '0 20px'}}>
            <FormControl style={{marginTop:'10vh', width:'100%'}}>
                <FormLabel style={{textAlign:'center'}} id="demo-row-radio-buttons-group-label">Squeal type</FormLabel>
                <RadioGroup
                    row
                    style={{justifyContent:'center'}}
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    defaultValue="text"
                    name="row-radio-buttons-group"
                    onChange={handleSquealTypeChange}
                >
                    <FormControlLabel value="text" control={<Radio />} label="Text" />
                    <FormControlLabel value="image" control={<Radio />} label="Image" />
                    <FormControlLabel value="location" control={<Radio />} label="Location" />
                </RadioGroup>
            </FormControl>
            <div id='chars-count-container' style={{backgroundColor: 'var(--light-bg)', transitionDuration:'0.3', marginTop:'20px', width:'calc(100% - 30px)', padding:'10px 15px', display:'flex', flexFlow:'column', gap:'10px', borderRadius:'10px'}}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize: '1.2rem'}}>
                    <span>Daily characters left:</span>
                    <span style={{textAlign: 'end'}}>{maxDayChars}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize: '1.2rem'}}>
                    <span>Weekly characters left:</span>
                    <span style={{textAlign: 'end'}}>{maxWeekChars}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize: '1.2rem'}}>
                    <span>Monthly characters left:</span>
                    <span style={{textAlign: 'end'}}>{maxMonthChars}</span>
                </div>
            </div>
            {
                    //check if squeal type is text
                    squealType === "text" ?
                        <TextField
                            style={{marginTop:'20px', backgroundColor: 'var(--light-bg)'}}
                            id="outlined-multiline-flexible"
                            fullWidth
                            label="Squeal"
                            multiline
                            onChange={handleSquealTextChange}
                        />
                    : squealType === "image" ?
                            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                Upload image
                                <VisuallyHiddenInput type="file"/>
                            </Button>
                    : squealType === "location" ?
                                <p>Location</p>
                                : <div></div>
            }

        </div>

    )
}


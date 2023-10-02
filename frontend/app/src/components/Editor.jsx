import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    Radio,
    RadioGroup,
    styled,
    TextField
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import * as PropTypes from "prop-types";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import "../css/NewSqueal.css";
import {scryRenderedComponentsWithType} from "react-dom/test-utils";

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


const IMAGE_CHAR_SIZE = 125;
export default function Editor(props) {

    useEffect(() => {
        let input = document.getElementById("outlined-multiline-flexible");
        input.addEventListener("select", getTextSelection);
        input.addEventListener('keypress', checkcaret); // Every character written
        input.addEventListener('mousedown', checkcaret); // Click down
        input.addEventListener('touchstart', checkcaret); // Mobile
        input.addEventListener('input', checkcaret); // Other input events
        input.addEventListener('paste', checkcaret); // Clipboard actions
        input.addEventListener('cut', checkcaret);
        input.addEventListener('mousemove', checkcaret); // Selection, dragging text
        input.addEventListener('select', checkcaret); // Some browsers support this event
        input.addEventListener('selectstart', checkcaret); // Some browsers support this event

    }, [])



    //Chars left
    const [maxDayChars, setMaxDayChars] = React.useState(props.day_max);
    const initialDayChars = props.day_max;
    const [maxWeekChars, setMaxWeekChars] = React.useState(props.week_max);
    const initialWeekChars = props.week_max;
    const [maxMonthChars, setMaxMonthChars] = React.useState(props.month_max);
    const initialMonthChars = props.month_max;

    //Squeal type
    const [squealType, setSquealType] = React.useState("text");

    //Image loading
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    function resetCharCount() {
        setMaxDayChars(initialDayChars);
        setMaxWeekChars(initialWeekChars);
        setMaxMonthChars(initialMonthChars);
    }
    function decreaseCharCount(value) {

        //check if max chars reached
        if ((initialDayChars - value) < 0 || (initialWeekChars - value) < 0 || (initialMonthChars - value) < 0) {
            //check if type is text
            if (squealType === "text") {
                //remove last character from text
                document.getElementById("outlined-multiline-flexible").value = document.getElementById("outlined-multiline-flexible").value.slice(0, -1);
                alert("You have reached the maximum number of characters for this squeal type.");
            } else if (squealType === "image") {
                alert("Image size is 125 characters so you cannot upload it at this time.");
                setImage(null);
            }
            return;
        }

        setMaxDayChars(initialDayChars - value);
        setMaxWeekChars(initialWeekChars - value);
        setMaxMonthChars(initialMonthChars - value);
    }

    function handleSquealTextChange(event) {
        //check if squeal type is text
        if (squealType !== "text") {
            return;
        }

        //update char count
        decreaseCharCount(event.target.value.length);

        //regex for web links
        const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(?:\/\S*)?/g;
        const mentionRegex = /[§@#]\w+/g;

        //split text into array
        const segments = event.target.value.split(" ");

        //iterate over segments
        for (let i = 0; i < segments.length; i++) {
            if (segments[i] === '\n') {
                continue;
            }
            //check if segment contains \n
            if (segments[i].includes("\n")) {

                //split segment into array
                const lines = segments[i].split("\n");
                let tmp_seg = [];
                //iterate over lines
                for (let j = 0; j < lines.length; j++) {
                    //push line to tmp array
                    tmp_seg.push(lines[j]);
                    //push \n
                    tmp_seg.push("\n");
                }
                //remove last char, if segment ends with \n is empty while if it does not ends with \n is \n
                tmp_seg.pop();
                //insert tmp array into segments at index i
                segments.splice(i, 1, ...tmp_seg);
            }
        }

        //check if last segment's last char is \n
        if (segments[segments.length - 1].endsWith("\n")) {
            if (segments[segments.length - 1] !== "\n") {
                //remove last char
                segments[segments.length - 1] = segments[segments.length - 1].slice(0, -1);
                //push \n to new segment
                segments.push("\n");
            }
        }



        let counter = -1;
        //generate HTML
        let html = segments.map((segment, index) => {

            let selected = false;
            let selectedFromStart = 0;
            let selectedFromEnd = 0;
            let unselectedFromSides = [];
            //check if user has selected text
            if (startPos !== -1 && endPos !== -1) {

                if (segment !== "" && segment !== '\n') {
                    //check if word is fully selected
                    if (counter + 1 >= startPos && counter + segment.length <= endPos) {
                        selected = true;
                    } //first part of word selected
                    else if (startPos <= counter + 1 && endPos < counter + segment.length) {
                        selectedFromStart = endPos - counter - 1;
                    } //last part of word selected
                    else if (startPos > counter + 1 && endPos >= counter + segment.length) {
                        selectedFromEnd = counter + segment.length - startPos + 1;
                    } //middle part of word selected
                    else if (startPos > counter + 1 && endPos < counter + segment.length) {
                        unselectedFromSides.push(startPos - counter - 1);
                        unselectedFromSides.push(counter + segment.length - endPos + 1);
                    }
                }
            }

            /*TODO FIX
               if (curPos === 0 && index === 0) {
                segment = "|" + segment;
            } else if (curPos === counter + segment.length) {
                segment = segment + "|";
            }*/

            if (curPos >= counter + 1 && curPos <= counter + segment.length) {
                //get characters before cursor position
                let firstChars = segment.substring(0, curPos - counter - 1);
                //get characters after cursor position
                let lastChars = segment.substring(curPos - counter - 1, segment.length);
                segment = firstChars + "|" + lastChars;
                console.log([firstChars, lastChars]);
            }

            //increase counter
            counter += segment.length;

            //whitespace handling
            if (segment !== '\n') {
                counter += 1;
            }

            if (segment.match(urlRegex) || segment.match(mentionRegex)) {
                //TODO create array of links and mentions
                if (selectedFromStart > 0) {
                    let firstChars = segment.substring(0, selectedFromStart);
                    let lastChars = segment.substring(selectedFromStart, segment.length);
                    return `<span class="selected highlight">${firstChars}</span><span class="highlight">${lastChars}</span>`
                } else if (selectedFromEnd > 0) {
                    //get last 3 chars
                    let firstChars = segment.substring(0, segment.length - selectedFromEnd);
                    let lastChars = segment.substring(segment.length - selectedFromEnd, segment.length);
                    return `<span class="highlight">${firstChars}</span><span class="selected highlight">${lastChars}</span>`
                } else if (unselectedFromSides.length === 2) {
                    //get last 3 chars
                    let firstChars = segment.substring(0, unselectedFromSides[0]);
                    let middleChars = segment.substring(unselectedFromSides[0], segment.length - unselectedFromSides[1]);
                    let lastChars = segment.substring(segment.length - unselectedFromSides[1], segment.length);
                    return `<span class="highlight">${firstChars}</span><span class="selected highlight">${middleChars}</span><span class="highlight">${lastChars}</span>`
                }

                return `<span class="highlight ${selected ? 'selected' : ''}">${segment}</span>`
            } else if (segment.includes("\n")) {
                //check if next segment exists
                if (segments[index + 1] !== undefined && segments[index + 1] !== "") {
                    return `<br>`
                }
                else {
                    //put whitespace to trigger new line on div
                    return `<br><span style="color: transparent">*</span>`
                }
            }
            else if (segment === "") {
                return ``;
            }
            else {

                if (selectedFromStart > 0) {
                    let firstChars = segment.substring(0, selectedFromStart);
                    let lastChars = segment.substring(selectedFromStart, segment.length);
                    return `<span class="selected">${firstChars}</span><span>${lastChars}</span>`
                } else if (selectedFromEnd > 0) {
                    //get last 3 chars
                    let firstChars = segment.substring(0, segment.length - selectedFromEnd);
                    let lastChars = segment.substring(segment.length - selectedFromEnd, segment.length);
                    return `<span>${firstChars}</span><span class="selected">${lastChars}</span>`
                } else if (unselectedFromSides.length === 2) {
                    let firstChars = segment.substring(0, unselectedFromSides[0]);
                    let middleChars = segment.substring(unselectedFromSides[0], segment.length - unselectedFromSides[1]);
                    let lastChars = segment.substring(segment.length - unselectedFromSides[1], segment.length);
                    return `<span>${firstChars}</span><span class="selected">${middleChars}</span><span>${lastChars}</span>`
                }

                return `<span class="${selected ? 'selected' : ''}">${segment}</span>`
            }
        }).join(' ');

        //append cursor to html
        //html += `<span style="color: var(--primary)">|</span>`;

        //update masked content
        document.getElementById("masked-content").innerHTML = html;
    }



    let startPos = -1;
    let endPos = -1;

    let curPos = 0;
    function checkcaret(event) {
        const newPos = document.getElementById("outlined-multiline-flexible").selectionStart;
        if (newPos !== curPos) {
            console.log('change to ' + newPos);
            curPos = newPos;
        }
        handleSquealTextChange(event);
    }

    function getTextSelection(event) {
        startPos = event.target.selectionStart;
        endPos = event.target.selectionEnd;
        let selectedText = event.target.value.substring(startPos, endPos);
        handleSquealTextChange(event);
        event.target.addEventListener("click", inputClickHandler);
    }

    let savedSelection = "";
    function inputClickHandler(event) {
        //update positions for race condition
        startPos = event.target.selectionStart;
        endPos = event.target.selectionEnd;
        //get selected text
        let selectedText = event.target.value.substring(startPos, endPos);
        //check if user nulled the selection or race condition between unselect and click occurred
        if (selectedText === "" || selectedText === " " || selectedText === savedSelection) {
            //clear Ui selection
            startPos = -1;
            endPos = -1;
            handleSquealTextChange(event);
            event.target.removeEventListener("click", inputClickHandler);
        } else {
            //save the selection to avoid race condition on next click
            savedSelection = selectedText;
        }
    }

    function handleSquealTextFocus(event) {
        //check if squeal type is text
        if (squealType !== "text") {
            return;
        }
        if (event.target.value.length === 0) {
            document.getElementById("masked-content").innerText = "";
        }
    }

    //handle radio button change
    function handleSquealTypeChange(event) {
        //set squeal type
        setSquealType(event.target.value);
        //reset char count
        resetCharCount();
        //reset image
        setImage(null);
    }

    async function handleImageUpload(event) {
        setIsLoading(true);

        let file = event.target.files[0];

        if (file) {
            //display image
            setImage(URL.createObjectURL(file));

            //update char count
            decreaseCharCount(IMAGE_CHAR_SIZE);
        }

        setIsLoading(false);
    }

    function handleImageDelete() {
        setImage(null);
        resetCharCount();
    }

    function insertSymbol(symbol) {

        if (document.getElementById("outlined-multiline-flexible").value === "") {
            return;
        }

        //add symbol to text
        document.getElementById("outlined-multiline-flexible").value += (" " + symbol);
        //trigger change event
        handleSquealTextChange({target: {value: document.getElementById("outlined-multiline-flexible").value}});
        //focus on text
        document.getElementById("outlined-multiline-flexible").focus();

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
                    select
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
                        <div style={{width:'100%', position:'relative'}}>
                            <TextField onFocus={handleSquealTextFocus} style={{marginTop:'20px', opacity:'0', backgroundColor: 'var(--light-bg)'}} id="outlined-multiline-flexible" fullWidth label="Squeal" multiline onChange={handleSquealTextChange}/>
                            <div id="editor-input-mask">
                                <span id="masked-content">Insert...</span>
                            </div>
                            <div style={{display:"flex", marginTop:'20px', justifyContent:'center', gap:'15px'}}>
                                <div onClick={() => insertSymbol('@')} className={"symbol"}>@</div>
                                <div onClick={() => insertSymbol('#')} className={"symbol"}>#</div>
                                <div onClick={() => insertSymbol('§')} className={"symbol"}>§</div>
                            </div>
                            <button onClick={getTextSelection}>Get selection</button>
                        </div>



                    : squealType === "image" ?
                            <div style={{position:"relative"}}>
                                <input style={{width:'100%', marginTop:'20px', height:'50px'}} type="file" accept="image/*" onChange={handleImageUpload} />
                                <div style={{width:'100%', display:'flex', justifyContent:'center', color:'var(--text-light)', alignItems:'center', cursor:'pointer', height:'55px', pointerEvents:'none', backgroundColor:'var(--light-bg)', marginTop:'20px', border:"solid 1px var(--text-light)", borderRadius:'5px', position:'absolute', top:'0'}}>
                                    { image ? "Click to change image" : "Click to upload an image" }
                                </div>

                                {isLoading ? (
                                    <div>Loading...</div> // You can replace this with a spinner component
                                ) : image ? (
                                    <div style={{width:'100%', position:'relative', marginTop:'20px', border:'solid 2px var(--text-light)', borderRadius:'10px', overflow:'hidden'}}>
                                        <img style={{width:'100%'}} src={image} alt="Uploaded" />
                                        <IconButton onClick={handleImageDelete} style={{position:'absolute', top:'10px', left:'10px', color:'white', backgroundColor:'#000000aa'}} aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>

                                ) : null}

                            </div>
                    : squealType === "location" ?
                                <p>Location</p>
                                : null
            }

        </div>

    )
}


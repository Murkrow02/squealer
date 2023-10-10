import * as React from 'react';
import { useState, useEffect } from 'react';
import {Button, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, styled, TextField } from "@mui/material";
import {MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents} from 'react-leaflet';
import DeleteIcon from '@mui/icons-material/Delete';
import * as PropTypes from "prop-types";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import "../css/NewSqueal.css";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {scryRenderedComponentsWithType} from "react-dom/test-utils";
import ActionButton from "./ActionButton";

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
const LOCATION_CHAR_SIZE = 125;
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

    //Image loading
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    //Location
    const [location, setLocation] = useState([44.496352274776775, 371.3422250747681]);

    L.Marker.prototype.options.icon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [24,36],
        iconAnchor: [12,36]
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
        } else {
            console.log("Geolocation not supported");
        }
    }, []);

    //Real location
    const MapEvents = () => {
        let map = useMap();

        useMapEvents({
            click(e) {
                //set marker location
                setLocation([e.latlng.lat, e.latlng.lng]);
                //move map to new location
                map.flyTo([e.latlng.lat, e.latlng.lng], map.getZoom());
            },
        });
        return false;
    }

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

        //check if last char is invalid
        if (event.target.value.endsWith(">") || event.target.value.endsWith("<")) {
            //remove last character from text
            document.getElementById("outlined-multiline-flexible").value = document.getElementById("outlined-multiline-flexible").value.slice(0, -1);
            alert("Invalid character.");
            return;
        }

        //update char count
        decreaseCharCount(event.target.value.length);

        //regex for web links
        const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(?:\/\S*)?/g;
        const mentionRegex = /^[@#§]\w+/g;

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

        //generate HTML
        let html = segments.map((segment, index) => {

            if (segment.match(urlRegex) || segment.match(mentionRegex)) {
                return `<span class="highlight">${segment}</span>`
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
                return `<span>${segment}</span>`
            }
        }).join(' ');



        //update masked content
        document.getElementById("masked-content").innerHTML = html;
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

        if (event.target.value === "location") {
            decreaseCharCount(LOCATION_CHAR_SIZE);
        }
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

    function locationSuccess(position) {
        //get latitude and longitude
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        //update location
        setLocation([latitude, longitude]);
    }
    function locationError() {
        //Notify user that location could not be retrieved
        alert("Unable to retrieve your location");
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
                            <TextField onFocus={handleSquealTextFocus} style={{marginTop:'20px', backgroundColor: 'var(--light-bg)'}} id="outlined-multiline-flexible" fullWidth label="Squeal" multiline onChange={handleSquealTextChange}/>
                            <div id="editor-input-mask">
                                <span id="masked-content"></span>

                            </div>
                            <div style={{display:"flex", marginTop:'20px', justifyContent:'center', gap:'15px'}}>
                                <div onClick={() => insertSymbol('@')} className={"symbol"}>@</div>
                                <div onClick={() => insertSymbol('#')} className={"symbol"}>#</div>
                                <div onClick={() => insertSymbol('§')} className={"symbol"}>§</div>
                            </div>
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
                                <div>
                                    <div style={{height:'300px', overflow:"hidden", borderRadius:'10px', marginTop:"20px"}}>
                                        <MapContainer id="map" style={{ width: "100%", height: "300px" }} center={location} zoom={13} scrollWheelZoom={false}>
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker position={location}>
                                                <Popup>
                                                    A pretty CSS3 popup. <br /> Easily customizable.
                                                </Popup>
                                            </Marker>
                                            <MapEvents />
                                        </MapContainer>
                                    </div>
                                    <p style={{color:'var(--text-light)', textAlign:'center'}}>Click on the map to select a new point</p>
                                </div>
                : null
            }
            <div style={{margin: '0 -10px'}}>
                <ActionButton classes={"profile-action-button"} text={"Post"} type={"primary"} />
            </div>

        </div>

    )
}


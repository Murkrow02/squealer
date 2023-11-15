import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    Radio,
    RadioGroup,
    Switch,
    styled, Tab, Tabs,
    TextField, Typography
} from "@mui/material";
import {MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents} from 'react-leaflet';
import DeleteIcon from '@mui/icons-material/Delete';
import * as PropTypes from "prop-types";
import "../css/NewSqueal.css";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import ActionButton from "./ActionButton";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Box from "@mui/material/Box";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

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
    const [isSquealTemporized, setIsSquealTemporized] = React.useState(false);
    const [isSquealWeather, setIsSquealWeather] = React.useState(false);

    //Image loading
    const [media, setMedia] = useState(null);
    const [mediaFile, setMediaFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mediaLoadingType, setMediaLoadingType] = useState("gallery");

    //Location
    const [location, setLocation] = useState([44.496352274776775, 371.3422250747681]);

    //Receiver tabs
    const [receiverTabValue, setReceiverTabValue] = React.useState('1');
    const handleReceiverTabChange = (event, newValue) => {
        setReceiverTabValue(newValue);
        //Clear search selection
        setReceiverSearchList([]);
        //Clear search input
        document.querySelector('.receivers-search-bar').value = "";
        //Reload receiver list
        onReceiverInputChange({target: {value: ""}});
    };

    //Receiver tab dict
    const receiverTabDict = {
        1: "user",
        2: "channel",
        3: "tag"
    }

    const receiverTabSymbolDict = {
        1: "@",
        2: "§",
        3: "#"
    }

    //Receiver popup visibility
    const [receiverPopupVisible, setReceiverPopupVisible] = React.useState(false);

    //Receiver search content
    const [receiverSearchList, setReceiverSearchList] = React.useState([]);

    //Receiver list
    const [receiverList, setReceiverList] = React.useState([]);

    //Variables list
    const [variablesList, setVariablesList] = React.useState([])

    //Weather data
    const [locationLight, setLocationLight] = React.useState("day");
    const [locationWeatherImage, setLocationWeatherImage] = React.useState("");
    const [locationWeatherDescription, setLocationWeatherDescription] = React.useState("");
    const [locationWeatherTemperature, setLocationWeatherTemperature] = React.useState(0);

    //Marker configuration
    L.Marker.prototype.options.icon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [24,36],
        iconAnchor: [12,36]
    });

    //Get location on appearing
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
        } else {
            console.log("Geolocation not supported");
        }
    }, []);

    const MapEvents = () => {
        let map = useMap();

        useMapEvents({
            click(e) {
                //set marker location
                setLocation([e.latlng.lat, e.latlng.lng]);
                //move map to new location
                map.flyTo([e.latlng.lat, e.latlng.lng], map.getZoom());

                if (isSquealWeather) {
                    updateWeatherData();
                }
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
                setMedia(null);
            }
            return;
        }

        setMaxDayChars(initialDayChars - value);
        setMaxWeekChars(initialWeekChars - value);
        setMaxMonthChars(initialMonthChars - value);
    }

    //regex for mentions, urls and variables
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(?:\/\S*)?/g;
    const mentionRegex = /^[@#§]\w+/g;
    const variableRegex = /^[$]\w+/g;

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

        //clear variables and store them for later check
        let variables = variablesList;
        let tmpVariables = [];

        //generate HTML & update masked content
        document.getElementById("masked-content").innerHTML = segments.map((segment, index) => {

            if (segment.match(urlRegex)) {
                //check if segment starts with http
                let href = segment;
                if (!segment.startsWith("http")) {
                    //add http
                    href = "https://" + segment;
                }
                return `<a href="${href}" target="_blank" class="highlight">${segment}</a>`
            }
            else if (segment.match(mentionRegex)) {
                return `<span class="highlight">${segment}</span>`
            }
            else if ( isSquealTemporized && segment.match(variableRegex)) {
                //push variable to tmp variables list
                tmpVariables.push({name: segment, type: "unset"});
                return `<span class="variable">${segment}</span>`
            } else if (segment.includes("\n")) {
                //check if next segment exists
                if (segments[index + 1] !== undefined && segments[index + 1] !== "") {
                    return `<br>`
                } else {
                    //put whitespace to trigger new line on div
                    return `<br><span style="color: transparent">*</span>`
                }
            } else if (segment === "") {
                return ``;
            } else {
                return `<span>${segment}</span>`
            }
        }).join(' ');

        if (isSquealTemporized) {
            for (let i = 0; i < tmpVariables.length; i++) {
                //check if variables[i] still exists
                if (variables[i] !== undefined) {
                    if (tmpVariables[i].name === variables[i].name) {
                        //set type
                        tmpVariables[i].type = variables[i].type;
                    }
                }
            }
            //update variables list
            setVariablesList(tmpVariables);
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
        setMedia(null);
        //reset variables
        setVariablesList([]);
        //reset to default squeal
        setIsSquealTemporized(false);
        if (event.target.value === "location") {
            decreaseCharCount(LOCATION_CHAR_SIZE);
        }
    }
    function handleImageUploadingTypeChange(event) {
        //set image type
        setMediaLoadingType(event.target.value);
        //reset image
        setMedia(null);
        //reset url
        document.getElementById("image-uri-input").value = "";
        //reset char count
        resetCharCount();
    }
    async function handleImageUpload(event) {
        setIsLoading(true);

        let file = event.target.files[0];

        if (file) {
            //set media file
            setMediaFile(file);
            //display image
            setMedia(URL.createObjectURL(file));

            //update char count
            decreaseCharCount(IMAGE_CHAR_SIZE);
        }

        setIsLoading(false);
    }
    function handleImageDelete() {
        setMedia(null);
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
    function onReceiverInputChange(event) {

        let searchValue = event.target.value;
        console.log("searching:" + searchValue);

        if (searchValue.length <= 0) {
            return;
        }

        //check if type is @ (1)
        if (receiverTabValue === '1') {
            //get users
            window.searchByUsername(searchValue).then((users) => {
                setReceiverSearchList(users.data);
                console.log(users);
            }).catch((error) => {
                console.log(error);
            });
        } else if (receiverTabValue === '2') {

            window.getChannelsByCategory('public', searchValue).then((channels) => {
                console.log(channels);
                //get subscribed channels
                let avail_channels = channels.data.filter((channel) => {
                    return channel.category === 'public';
                });
                //set search list
                setReceiverSearchList(avail_channels);
            }).catch((error) => {
                console.log(error);
            });
        } else if (receiverTabValue === '3') {
            //clear search list
            setReceiverSearchList([]);
            //set written tag in list, id is the value so don't have to handle it as receivers are univoque per type
            setReceiverSearchList([{ _id: event.target.value, content: event.target.value, type: "3" }]);
        }
    }
    function checkDuplicateReceiver(receiver_id, receiver_type) {
        //get receivers list
        let list = receiverList;
        console.log("checking " + receiver_id + " of type" + receiver_type);
        //iterate over list
        for (let i = 0; i < list.length; i++) {
            //check if receiver exists
            if (list[i].id === receiver_id && list[i].type === receiver_type) {
                console.log("element" + receiver_id + " already in the list");
                return true;
            }
        }
        return false;
    }
    function addReceiver(receiver_id, receiver_name, receiver_type) {
        //check if receiver already exists
        if (checkDuplicateReceiver(receiver_id, receiver_type)) {
            alert("Receiver already in the list");
            return;
        }
        //get receivers list
        let list = receiverList;
        //add receiver
        list.push({id: receiver_id, name: receiver_name, type: receiver_type});

        console.log(list);
        //update receivers list
        setReceiverList(list);
    }
    function removeReceiver(receiver_id, receiver_type) {
        //get receivers list
        let list = receiverList;
        //iterate over list
        for (let i = 0; i < list.length; i++) {
            //check if receiver exists
            if (list[i].id === receiver_id && list[i].type === receiver_type) {
                //remove receiver
                list.splice(i, 1);
                //update receivers list
                setReceiverList(list);
                //refresh ui
                setReceiverList([...receiverList]);
                return;
            }
        }
    }
    function onReceiverSearchClick(event) {
        //get clicked element
        const target = event.target;
        //get id
        const target_id = target.id;
        //split string by - character
        const receiver_id = target_id.split('-')[2];
        if (receiver_id === "none") {
            alert("Invalid receiver, no private channel found");
            return;
        }
        //get receiver name
        const receiver_name = (target.childNodes[0].innerText).substring(1);
        //add receiver to list
        addReceiver(receiver_id, receiver_name, receiverTabValue);

        if (receiverTabValue !== '3') {
            //fade add button
            target.childNodes[1].style.opacity = "0";
        }
    }
    //Triggered when + button near receivers list is clicked
    function showReceiverOverlay(event) {
        //show overlay
        setReceiverPopupVisible(true);


    }
    function hideReceiverOverlay(event) {
        //hide overlay
        setReceiverPopupVisible(false);
        //reset search list
        setReceiverSearchList([]);
        //reset search input
        document.querySelector('.receivers-search-bar').value = "";
    }
    function convertToTemporizedSqueal(event) {
        setIsSquealTemporized(true);
        //TODO UPDATE UI IF ALREADY VARIABLES
    }
    function revertToNormalSqueal(event) {
        setIsSquealTemporized(false);
        //clear variables
        setVariablesList([]);
        //TODO UPDATE UI IF ALREADY VARIABLES
    }
    function onVariableSelectChange(event) {
        //get name of variable
        const variable_name = event.target.id.split('-')[3];
        //get variable type
        const variable_type = event.target.value;
        //get variables list
        let list = variablesList;
        //update variable type
        for (let i = 0; i < list.length; i++) {
            if (list[i].name === variable_name) {
                list[i].type = variable_type;
                break;
            }
        }
        console.log(list);
        //update variables list
        setVariablesList(list);
    }
    function imageSearchClicked(event) {
        let target = document.getElementById("image-uri-input");
        //check if text is empty
        if (target.value === "") {
            return;
        }

        //check if text matches url regex
        if (!target.value.match(urlRegex)) {
            alert("Invalid url");
            return;
        }
        function isMedia(url) {
            return /\.(jpg|jpeg|png|webp|avif|heic|gif|svg|mp4|webm)$/.test(url);
        }

        //check if url is a valid media
        if (!isMedia(target.value)) {
            alert("Invalid url");
            return;
        }

        //update char count
        resetCharCount();
        decreaseCharCount(IMAGE_CHAR_SIZE);
        //display image
        setMedia(target.value);
    }
    function moduleCoordinate(value, type, sign) {
        let _value = value;
        if (sign === -1) {
            _value = -_value;
        }
        //get decimal part
        let decimal = _value - Math.floor(_value);
        //get integer part
        let integer = Math.floor(_value) % (type === "longitude" ? 180 : 90);
        //add decimal part
        _value = integer + decimal;
        //reset sign
        if (sign === -1) {
            _value = -_value;
        }
        return _value;
    }
    async function updateWeatherData() {
        //fetch from openweather
        console.log("map: " + location);
        let selectedLocation = location;

        //check if location longitude is over 180 or under -180
        if (selectedLocation[1] > 180 || selectedLocation[1] < -180) {
            selectedLocation[1] = moduleCoordinate(selectedLocation[1], "longitude", selectedLocation[1] < 0 ? -1 : 1);
        }
        //check if location latitude is over 90 or under -90
        if (selectedLocation[0] > 90 || selectedLocation[0] < -90) {
            selectedLocation[0] = moduleCoordinate(selectedLocation[0], "latitude", selectedLocation[0] < 0 ? -1 : 1);
        }

        console.log("moduled:" + selectedLocation);
        let weatherRequest = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + location[0] + "&longitude=" + location[1] + "&current=temperature_2m,weathercode,is_day")
        if (!weatherRequest.ok) {
            console.log("Error while fetching weather data");
            return;
        }
        //get json
        let weatherResponse = await weatherRequest.json();
        //get location light
        setLocationLight(weatherResponse.current.is_day === 0 ? "night" : "day");
        //get location temperature
        setLocationWeatherTemperature(weatherResponse.current.temperature_2m);
        //get json at helpers/WeatherInfo.json
        let weatherInfo = require('../helpers/WeatherInfo.json');
        //get weatherCode image
        setLocationWeatherImage(weatherInfo[weatherResponse.current.weathercode][weatherResponse.current.is_day === 0 ? "night" : "day"].image);
        //get weatherCode description
        setLocationWeatherDescription(weatherInfo[weatherResponse.current.weathercode][weatherResponse.current.is_day === 0 ? "night" : "day"].description);
    }
    async function convertToWeatherSqueal(event) {
        setIsSquealWeather(true);
        if (location === null) {
            return;
        }
        await updateWeatherData();
    }
    function revertToLocationSqueal(event) {
        setIsSquealWeather(false);
    }

    function postSquealClicked(event) {

        //manage receivers
        let channels = [];
        console.log(receiverList);
        //get receivers
        for (let i = 0; i < receiverList.length; i++) {
            channels.push(receiverList[i].id);
        }
        //check if there are receivers
        if (channels.length === 0) {
            alert("No receivers selected");
            return;
        }

        //manage content
        let squeal = {};
        //get type
        squeal["contentType"] = squealType === "image" ? "media" : squealType;
        //upload switch
        let uploadNeeded = false;

        function areTemporizedInputsValid() {
            let ttlInput = document.getElementById("ttl-input");
            let etInput = document.getElementById("et-input");

            if (!ttlInput || !etInput || ttlInput.value === "" || etInput.value === "" || isNaN(ttlInput.value) || isNaN(etInput.value)) {
                return false;
            }
            if (parseInt(ttlInput.value) < 0 || parseInt(etInput.value) < 0) {
                return false;
            }
            if (parseInt(ttlInput.value) < parseInt(etInput.value) / 60) {
                return false;
            }

            return [ttlInput.value * 60 * 1000, etInput.value * 1000];
        }

        let temporizedValues = areTemporizedInputsValid();
        if ((isSquealTemporized || isLiveLocation) && temporizedValues === false) {
            alert("Invalid temporized values");
            return;
        }

        //get content
        switch (squealType) {
            case "text":
                squeal["content"] = document.getElementById("masked-content").innerHTML

                if (isSquealTemporized) {
                    //check that variables are set
                    for (let i = 0; i < variablesList.length; i++) {
                        if (variablesList[i].type === "unset") {
                            alert("Please set " + variablesList[i].name + " variable");
                            return;
                        }
                    }
                    console.log("temporized text");
                    console.log("ttl", temporizedValues[0], "et", temporizedValues[1]);
                    console.log(variablesList);
                    alert('Warning, page reload or app exit will stop the temporized squeal posting');
                    window.sendVariablesSqueal(temporizedValues[1], temporizedValues[0], squeal, 0, channels, variablesList);
                    alert("All squeals posted");
                    return;
                }
                break;
            case "image":
                squeal["contentType"] = "media";
                if (mediaLoadingType === "url") {
                    squeal["mediaUrl"] = media;
                } else {
                    uploadNeeded = true;
                    break;
                }
                break;
            case "location":
                squeal["contentType"] = "map";
                squeal["mapPoints"] = [{ "latitude": location[0], "longitude": location[1] }];
                if (isSquealWeather) {
                    squeal["variant"] = "weather";
                }
                break;
            default:
                alert("Unsupported squeal type");
                return;
        }

        console.log(squeal);

        //post squeal
        window.postSqueal(squeal, channels).then((response) => {
            if (response.status === 201) {
                if (uploadNeeded) {
                    console.log(response);
                    let resJson = response.data;
                    console.log(resJson);
                    window.postMediaToSqueal(resJson._id, mediaFile).then((response) => {
                        console.log(response);
                    });
                }

                alert("Squeal posted");
                //get response json
                let resJson = response.data;


                if (squealType === "location" && isLiveLocation) {
                    console.log("live location");
                    console.log("ttl", temporizedValues[0], "et", temporizedValues[1]);
                    alert('Warning, page reload or app exit will stop the live location posting');
                    window.sendLiveLocationSqueal(temporizedValues[1], temporizedValues[0], resJson, 0, channels);
                }
            } else {
                alert(response.error);
            }
        });


    }

    const [isLiveLocation, setIsLiveLocation] = useState(false);
    const onLiveLocationSwitch = (event) => {
        setIsLiveLocation(event.target.checked);
    };

    return(
        <div style={{padding: '0 20px', marginTop:'10vh'}}>
            <div>
                <Typography style={{textAlign:'center', color:'rgba(0,0,0,0.6)'}}>Receivers</Typography>
                <div style={{display:"flex", gap:'10px', marginTop:'10px'}}>
                    <div className={"receivers-container"}>
                        {
                            receiverList.length === 0 ?
                                <Typography>Please select at least one receiver.</Typography>
                            :
                            receiverList.map((receiver) => {
                                return (
                                    <div className={"receiver-item"}>
                                        <span>{receiverTabSymbolDict[receiver.type] + receiver.name}</span>
                                        <CloseRoundedIcon onClick={() => { removeReceiver(receiver.id, receiver.type)}}/>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={'receivers-add-button'} onClick={showReceiverOverlay}>
                        <AddRoundedIcon />
                    </div>
                    <div style={{display: receiverPopupVisible ? "flex" : "none"}} className={"receivers-overlay"}>
                        <div className={"receivers-popup"}>
                            <div className={"receivers-popup-title-container"}>
                                <CloseRoundedIcon style={{cursor:'pointer'}} onClick={hideReceiverOverlay}/>
                            </div>
                            <input onChange={onReceiverInputChange} className={"receivers-search-bar"} type={"search"} placeholder={"Search"}/>
                            <Box sx={{ width: '100%', marginTop:'20px' }}>
                                <Tabs value={receiverTabValue} onChange={handleReceiverTabChange} variant="fullWidth" aria-label="secondary tabs example">
                                    <Tab value="1" label="@" />
                                    <Tab value="2" label="§" />
                                    <Tab value="3" label="#" />
                                </Tabs>
                            </Box>
                            <div className={"receivers-search-content-container"}>
                                {
                                    receiverSearchList.length === 0 ?
                                        <Typography style={{textAlign:'center', color:'rgba(0,0,0,0.6)'}}>No results</Typography>
                                        :
                                        receiverSearchList.map((receiver) => {
                                            return (
                                                <div id={"searched-receiver-" + (receiverTabValue === '1' ? (receiver.privateChannelId ? receiver.privateChannelId : "none-" + receiver._id) : receiver._id)} className={"receivers-search-item"} onClick={onReceiverSearchClick}>
                                                    <Typography>{receiverTabSymbolDict[receiverTabValue] +
                                                        (receiverTabValue === '1' ? receiver.username
                                                            : receiverTabValue === '2' ?
                                                                receiver.name.substring(1)
                                                            : receiverTabValue === '3' ?
                                                                receiver.content
                                                            : null)
                                                    }</Typography>
                                                    {
                                                        checkDuplicateReceiver(receiver._id, receiverTabValue) ?
                                                            <CheckRoundedIcon style={{color:"var(--primary)"}} />
                                                        :
                                                            <AddRoundedIcon style={{color:"var(--primary)"}} />
                                                    }
                                                </div>
                                            )
                                        })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FormControl style={{ width:'100%', marginTop:'20px'}}>
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
                    <FormControlLabel value="image" control={<Radio />} label="Media" />
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
                            {
                                 isSquealTemporized ?
                                     <div style={{marginTop:"20px"}}>
                                         <Typography style={{color:'var(--text-light)', textAlign:'center'}}>Type $ to add a variable</Typography>
                                         <div style={{marginTop:"20px"}}>
                                             {
                                                    variablesList.map((variable) => {
                                                        return (
                                                            <div className={"variable-item"} onClick={() => { document.getElementById("select-for-var-" + variable.name).click()}}>
                                                                <span className={"variable-name"}>{variable.name}</span>
                                                                <div style={{display:"flex", alignItems:'center', gap:'5px'}}>
                                                                    <span style={{color:'var(--text-light)'}}>Type:</span>
                                                                    <div className={"variable-type-container"} >
                                                                        <select onChange={onVariableSelectChange} id={"select-for-var-" + variable.name}>
                                                                            <option value="unset" selected={variable.type === "unset"} >unset</option>
                                                                            <option value="date" selected={variable.type === "date"}>date</option>
                                                                            <option value="time" selected={variable.type === "time"}>time</option>
                                                                            <option value="number" selected={variable.type === "number"}>number</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                             }
                                         </div>
                                     </div>
                                 : null
                            }
                            <div style={{margin: "20px -10px 0 -10px"}}>
                                {
                                    isSquealTemporized ?
                                        <div onClick={revertToNormalSqueal}>
                                            <ActionButton text={"Revert to default squeal"} type={"danger"}></ActionButton>
                                        </div>
                                    :
                                        <div onClick={convertToTemporizedSqueal} >
                                            <ActionButton text={"Convert to temporized squeal"} type={"secondary"}></ActionButton>
                                        </div>
                                }
                            </div>
                        </div>
                    : squealType === "image" ?
                        <div>
                            <FormControl style={{ width:'100%', marginTop:'20px'}}>
                                <FormLabel style={{textAlign:'center'}}>Import image or video from</FormLabel>
                                <RadioGroup
                                    row
                                    style={{justifyContent:'center'}}
                                    defaultValue="gallery"
                                    name="row-radio-buttons-group"
                                    onChange={handleImageUploadingTypeChange}
                                    select
                                >
                                    <FormControlLabel value="gallery" control={<Radio />} label="Gallery" />
                                    <FormControlLabel value="url" control={<Radio />} label="URL" />
                                </RadioGroup>
                            </FormControl>
                            <div style={{position:"relative"}}>
                                {
                                    mediaLoadingType === "gallery" ?
                                        <div>
                                            <input style={{width:'100%', marginTop:'20px', height:'50px'}} type="file" accept="image/*, video/*" onChange={handleImageUpload} />
                                            <div style={{width:'100%', display:'flex', justifyContent:'center', color:'var(--text-light)', alignItems:'center', cursor:'pointer', height:'55px', pointerEvents:'none', backgroundColor:'var(--light-bg)', marginTop:'20px', border:"solid 1px var(--text-light)", borderRadius:'5px', position:'absolute', top:'0'}}>
                                                { media ? "Click to change media" : "Click to upload a media" }
                                            </div>
                                        </div>
                                    :
                                        <div>
                                            <input id={"image-uri-input"} style={{width:'calc(100% - 70px - 2px)', padding:'0 60px 0 10px', fontSize:"1rem", border:"solid 1px var(--text-light)", backgroundColor:'var(--light-bg)', marginTop:'20px', height:'50px'}} type="text" placeholder="Media URL"  />
                                            <SearchRoundedIcon onClick={imageSearchClicked} style={{position:'absolute', right:'10px', top:'35px', cursor:'pointer'}}/>
                                        </div>
                                }


                                {isLoading ? (
                                    <div>Loading...</div> // You can replace this with a spinner component
                                ) : media ? (
                                    <div style={{width:'100%', position:'relative', marginTop:'20px', border:'solid 2px var(--text-light)', borderRadius:'10px', overflow:'hidden'}}>
                                        <img style={{width:'100%'}} src={media} alt="Uploaded" />
                                        <IconButton onClick={handleImageDelete} style={{position:'absolute', top:'10px', left:'10px', color:'white', backgroundColor:'#000000aa'}} aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>

                                ) : null}

                            </div>
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
                                    <div style={{display: isSquealWeather ? 'flex' : 'none', background: locationLight === "day" ? 'linear-gradient(261deg, #00affa 30%, #6cd1ff 70%)' : 'linear-gradient(261deg, #4c70b1 30%, #162d37 70.17%)'}} className={"weather-info-container"}>
                                        <div style={{display:'flex', alignItems:'center'}}>
                                            <img src={locationWeatherImage}/>
                                            <Typography id={"weather-info-label"}>{locationWeatherDescription}</Typography>
                                        </div>
                                        <Typography id={"weather-temperature-label"}>{locationWeatherTemperature}°</Typography>
                                    </div>
                                    <p style={{color:'var(--text-light)', textAlign:'center'}}>
                                        {
                                            isSquealWeather ?
                                                "Click on the map to select a new point and get the weather forecast"
                                            :
                                                "Click on the map to select a new point"
                                        }
                                    </p>
                                    {
                                        isSquealWeather ?
                                            null
                                        :
                                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                                <Typography>Live location squeal</Typography>
                                                <Switch checked={isLiveLocation} onChange={onLiveLocationSwitch} />
                                            </div>
                                    }
                                    <div style={{margin: "20px -10px 0 -10px"}}>
                                        {
                                            isSquealWeather ?
                                                <div onClick={revertToLocationSqueal}>
                                                    <ActionButton text={"Revert to location squeal"} type={"danger"}></ActionButton>
                                                </div>
                                            :
                                                <div onClick={convertToWeatherSqueal}>
                                                    <ActionButton text={"Create weather squeal"} type={"secondary"}></ActionButton>
                                                </div>
                                        }
                                    </div>
                                </div>
                : null
            }
            {
                isSquealTemporized || isLiveLocation ?
                    <div>
                        <div className={"temporized-input-row"}>
                            <Typography>Send for</Typography>
                            <div className={"temporized-inner-input-container"}>
                                <Typography>mins</Typography>
                                <TextField placeholder={"0"} type={"number"} id="ttl-input" variant="outlined" />
                            </div>
                        </div>
                        <div className={"temporized-input-row"}>
                            <Typography>Send every</Typography>
                            <div className={"temporized-inner-input-container"}>
                                <Typography>secs</Typography>
                                <TextField placeholder={"0"} type={"number"} id="et-input" variant="outlined" />
                            </div>
                        </div>
                    </div>
                : null
            }

            <div onClick={postSquealClicked} style={{margin: '0 -10px'}}>
                <ActionButton classes={"profile-action-button"} text={"Post"} type={"primary"} />
            </div>

        </div>
    )
}


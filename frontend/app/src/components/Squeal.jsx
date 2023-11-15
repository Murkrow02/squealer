import * as React from 'react';
import AddReactionRoundedIcon from '@mui/icons-material/AddReactionRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {Popover, Typography} from "@mui/material";
import {useEffect} from "react";
import {Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMap, useMapEvents} from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import weatherInfo from "../helpers/WeatherInfo.json";


export default function Squeal(props) {

    const [reactionPopoverAnchorEl, setReactionPopoverAnchorEl] = React.useState(null);

    const [avaiableReactions, setAvaiableReactions] = React.useState([]);
    const [reactions, setReactions] = React.useState([]);

    const [locationLight, setLocationLight] = React.useState("day");
    const [locationWeatherImage, setLocationWeatherImage] = React.useState("");
    const [locationWeatherDescription, setLocationWeatherDescription] = React.useState("");
    const [locationWeatherTemperature, setLocationWeatherTemperature] = React.useState(0);

    useEffect(() => {
        setAvaiableReactions(props.avaiableReactions);
        setReactions(props.reactions);
        updateWeatherData();
    }, []);


    L.Marker.prototype.options.icon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [24,36],
        iconAnchor: [12,36]
    });

    const handleReactionButtonClick = (event) => {
        setReactionPopoverAnchorEl(event.currentTarget);
    };
    const handleReactionPopoverClose = () => {
        setReactionPopoverAnchorEl(null);
    };
    const reactionPopoverOpen = Boolean(reactionPopoverAnchorEl);
    const reactionPopoverId = reactionPopoverOpen ? 'simple-popover' : undefined;

    function reactSqueal(reactionId) {
        console.log(props.id + " " + reactionId);
        window.reactToSqueal(props.id, reactionId).then((response) => {
            console.log(response);

            if (response.status !== 200) {
                alert(response.error);
                return;
            }
            //update local reactions
            let newReactions = reactions;
            for (let i = 0; i < newReactions.length; i++) {
                if (newReactions[i].reactionId === reactionId) {
                    newReactions[i].userReacted = true;
                    newReactions[i].count++;
                    setReactions(newReactions);
                    //close popover
                    handleReactionPopoverClose();
                    break;
                }
            }
        });
    }
    function unreactSqueal(reactionId) {
        console.log(props.id + " " + reactionId);
        window.unreactToSqueal(props.id, reactionId).then((response) => {
            console.log(response);
            if (response.status !== 200) {
                alert(response.error);
                return;
            }
            //update local reactions
            let newReactions = reactions;
            for (let i = 0; i < newReactions.length; i++) {
                if (newReactions[i].reactionId === reactionId) {
                    newReactions[i].userReacted = false;
                    newReactions[i].count--;
                    setReactions([...newReactions]);
                    break;
                }
            }
        });
    }

    async function updateWeatherData() {

        if (props.variant !== "weather" || props.mapPoints.length === 0) {
            return;
        }

        let location = [props.mapPoints[0].latitude, props.mapPoints[0].longitude];

        //fetch from openweather
        console.log("map: " + location);

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


    return(
        <div style={{width: '100vw', marginTop: '10px', position:'relative', zIndex:'0' , display:'flex', justifyContent:'center'}}>
            <div style={{width: '90vw', borderRadius:'10px', boxShadow:'0 0 42px -4px rgba(0,0,0,0.24)', height: 'fit-content', padding:'15px', backgroundColor:"white",}}>
                <div style={{display:'flex', gap:"5px"}}>
                    <span>Posted by</span>
                    <span style={{fontWeight:"bold"}}>@{props.username}</span>
                    <span style={{color: 'var(--karma)', fontWeight:"bold"}}>{props.karma}pts.</span>
                </div>
                <div className={"channels-container"}>
                    {props.channels.map((channel, index) => {
                        return(
                            <span style={{color: 'var(--primary)', fontSize:'0.8rem', padding:"8px 15px", borderRadius:'10px', backgroundColor:'var(--primary-bg)', fontWeight:"bold"}} key={index}>§{channel}</span>
                        )
                    })}
                </div>
                <div style={{display:'flex', gap:"8px", marginTop:"10px"}}>
                    {props.tags.map((tag, index) => {
                        return(
                            <span style={{color: 'var(--primary)', fontWeight:"bold"}} key={index}>#{tag}</span>
                        )
                    })}
                </div>
                <hr style={{marginTop:'10px', opacity:'0.4'}}></hr>
                <div style={{width: '100%', marginTop:'5px', display:'flex', justifyContent:'center'}}>
                    {
                        props.type === "text" ?
                        <div style={{ backgroundColor:'var(--light-bg)', width: '95%', borderRadius:'10px', height:'fit-content', padding:'10px'}}>
                            <div dangerouslySetInnerHTML={{ __html: props.content }} />
                            {props.content.length > 500 && (
                                <div style={{display:'flex', justifyContent:'flex-end'}}>
                                    <span style={{color:'var(--primary)', cursor:'pointer'}}>Read more...</span>
                                </div>
                            )}
                        </div>
                        : props.type === "media" ?
                            /\.(jpg|jpeg|png|webp|avif|heic|gif)$/.test(props.mediaUrl) ?
                                <img className={"squeal-image"} src={props.mediaUrl}/>
                            :
                                <video className={"squeal-video"} controls>
                                    <source src={props.mediaUrl} type="video/mp4"/>
                                </video>

                        : props.type === "map" && props.mapPoints.length > 0 ?
                                    <div style={{height:'300px', width:"100%", overflow:"hidden", borderRadius:'10px', marginTop:"20px"}}>
                                        <MapContainer id={"map-" + props.id} style={{ width: "100%", height: "300px" }} center={[props.mapPoints[0]["latitude"], props.mapPoints[0]["longitude"]]} zoom={13} scrollWheelZoom={false}>
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            {
                                                props.mapPoints.length > 1 ?
                                                    <>
                                                        <Polyline pathOptions={{color: 'var(--primary)'}} positions={props.mapPoints.map((point, index) => {
                                                            return [point["latitude"], point["longitude"]];
                                                        })}/>
                                                        {
                                                            props.mapPoints.map((point, index) => {
                                                                return <Circle center={[point["latitude"], point["longitude"]]} pathOptions={{color: 'white', fillColor:'white'}} radius={100}/>
                                                            })
                                                        }
                                                    </>
                                                :
                                                    <Marker position={[props.mapPoints[0]["latitude"], props.mapPoints[0]["longitude"]]}>
                                                        <Popup>
                                                            A pretty CSS3 popup. <br /> Easily customizable.
                                                        </Popup>
                                                    </Marker>
                                            }


                                        </MapContainer>
                                    </div>
                        : null
                    }
                </div>
                {
                    props.variant === "weather" ?
                        <div style={{display: 'flex', background: locationLight === "day" ? 'linear-gradient(261deg, #00affa 30%, #6cd1ff 70%)' : 'linear-gradient(261deg, #4c70b1 30%, #162d37 70.17%)'}} className={"weather-info-container"}>
                            <div style={{display:'flex', alignItems:'center'}}>
                                <img src={locationWeatherImage}/>
                                <Typography id={"weather-info-label"}>{locationWeatherDescription}</Typography>
                            </div>
                            <Typography id={"weather-temperature-label"}>{locationWeatherTemperature}°</Typography>
                        </div>
                    : null
                }
                <div style={{display:'flex', gap:"8px", marginTop:"10px"}}>
                    { reactions.map((reaction, index) => {
                        return(
                            <div style={{backgroundColor:'var(--light-bg)', padding:'5px', borderRadius:'10px', alignItems:'center', display:'flex', gap:'3px'}}>
                                <span aria-label={reaction.name}>{
                                    avaiableReactions.map((avaiableReaction, index) => {
                                        if(avaiableReaction._id === reaction.reactionId) {
                                            return(
                                                avaiableReaction.emoji
                                            )
                                        }
                                    })
                                }</span>
                                <span style={{fontWeight:"bold"}}>{reaction.count}</span>
                                {
                                    reaction.userReacted ?
                                        <CloseRoundedIcon onClick={() => {unreactSqueal(reaction.reactionId)}} style={{color:'var(--text-content)', cursor:'pointer'}}/>
                                    : null
                                }
                            </div>
                        )
                    })}
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:"20px", marginTop:'20px'}}>
                    <div aria-describedby={reactionPopoverId} onClick={handleReactionButtonClick} style={{backgroundColor:"white", padding:"10px", cursor:'pointer', gap:'5px', alignItems:'center', borderRadius:'10px', boxShadow:'0 0 42px -4px rgba(0,0,0,0.16)', display:'flex', justifyContent:'center'}}>
                        <AddReactionRoundedIcon style={{color:'var(--text-light)'}}/>
                        <span style={{color:"var(--text-light)"}}>React</span>
                    </div>
                    <Popover elevation={5} id={reactionPopoverId} open={reactionPopoverOpen} anchorEl={reactionPopoverAnchorEl} onClose={handleReactionPopoverClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                    >
                       <div style={{display:'flex', gap:'10px', padding:'10px 30px', borderRadius:"15px",}}>
                            {avaiableReactions.map((reaction, index) => {
                                return(
                                    <div onClick={() => {reactSqueal(reaction._id)}} style={{ padding:'5px', borderRadius:'10px', cursor:'pointer', display:'flex', gap:'3px'}}>
                                        <span className={"avaiable-reaction-emoji"}>{reaction.emoji}</span>
                                    </div>
                                )})
                            }
                       </div>
                    </Popover>
                    <div style={{backgroundColor:"white", cursor:'pointer', padding:"10px", gap:'5px', alignItems:'center', borderRadius:'10px', boxShadow:'0 0 42px -4px rgba(0,0,0,0.16)', display:'flex', justifyContent:'center'}}>
                        <ReplyRoundedIcon style={{color:'var(--text-light)'}}/>
                        <span style={{color:"var(--text-light)"}}>Reply</span>
                    </div>
                </div>

            </div>
        </div>

    );
}
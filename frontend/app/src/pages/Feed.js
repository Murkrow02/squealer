
//basic react imports
import React, { useState, useEffect, useRef } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Squeal from '../components/Squeal';
import "../css/Feed.css";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import {Popover, Tab, Tabs, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import CreateChannel from "../components/CreateChannel";

function 1Feed(props) {

    const [squeals, setSqueals] = useState([]);
    const [avaiableReactions, setAvaiableReactions] = useState([])
    useEffect(() => {
        window.getFeed().then((response) =>{
            console.log(response.data)
            setSqueals(response.data)
        });

        window.getAllReactions().then((response) =>{
            console.log(response.data)
            setAvaiableReactions(response.data)
        });
    },[]);

    //POPOVER HANDLING
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const popId = open ? 'simple-popover' : undefined;






    //SEARCH TYPE HANDLING
    const [searchType, setSearchType] = useState("text");
    const [searchTypeText, setSearchTypeText] = useState("aA");
    let searchTypeIcon = {
        "text": "aA",
        "channel": "§",
        "tag": "#",
        "user": "@"
    };

    let searchTypeTexts = {
        "text": "text",
        "channel": "channel",
        "tag": "hashtag",
        "user": "user"
    }

    function changeSearchType(type) {
        setSearchType(type);
        setSearchTypeText(searchTypeIcon[type]);
        //close popover
        handleClose();
    }

    //SEARCH TEXT HANDLING
    const [searchText, setSearchText] = useState("");
    let isSearching = false;

    const [displaySearchType, setDisplaySearchType] = useState("squeal");

    async function handleSearchTextChange(event) {

        //set search text
        setSearchText(event.target.value);

        await delay(100);

        //take mutex
        if (!isSearching) {
            isSearching = true;
        } else {
            return;
        }

        if (searchType === "channel" && value === "3") {
            let publicSqueals = await window.getChannelsByCategory("public", event.target.value);
            let editorialSqueals = await window.getChannelsByCategory("editorial", event.target.value);

            let squeals = publicSqueals.data.concat(editorialSqueals.data);
            setSqueals([]);
            setDisplaySearchType("channel");
            setSqueals(squeals);
            return;
        }

        setDisplaySearchType("squeal");

        //check if text is empty
        if(event.target.value === "") {
            window.getFeed().then((response) =>{
                console.log(response.data)
                setSqueals(response.data)
            });
            return;
        }




        if (searchType === "text") {
            window.getFeed(event.target.value).then((response) =>{
                console.log(response.data)
                setSqueals(response.data)
            });
            return;
        }




        //search for squeals
        let urlSearchType = searchTypeTexts[searchType];
        let urlSearchText = event.target.value;
        let urlSearchDestination = searchType === "text" ? "content" : value === '1' ? "mentioned" : "content";


        console.log("type: " + urlSearchType + " text: " + urlSearchText + " destination: " + urlSearchDestination);

        window.searchByChannelName(urlSearchType, urlSearchText, urlSearchDestination).then((response) =>{
            console.log(response.data);
            setSqueals(response.data)
        });
    }

    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const [value, setValue] = React.useState('1');

    const childRef = useRef(null);

    useEffect(() => {
        // action on update of movies
        handleSearchTextChange({target: {value: searchText}});
    }, [value, searchType]);

    const handleChange = (event, newValue) => {
        if (newValue !== "3") {
            setSqueals([]);
            setDisplaySearchType("squeal");
        }
        setValue(newValue);
    };

    const moveToNewSqueal = () => {
        props.moveToNewSqueal();
    }

    const [newChannelPopupVisibility, setNewChannelPopupVisibility] = useState(false);
    const handleChannelPopupVisibility = () => {
        console.log("clicked");
        setNewChannelPopupVisibility(!newChannelPopupVisibility);
    }

    function findChannelFromId(channelId) {
        return squeals.find((channel) => {
            return channel._id === channelId;
        });
    }
    
    function subscribeToChannel(channelId) {
        console.log(channelId);
        window.subscribeToChannel(channelId).then((response) =>{

            if (response) {
                alert("Subscribed to channel!");
                //change subscribed status
                let channel = findChannelFromId(channelId);
                channel.subscribed = true;
                setSqueals([...squeals]);

            }
        }).catch((error) => {
            alert("Error subscribing to channel!");
            console.log(error);
        });
    }

    function unsubscribeFromChannel(channelId) {
        window.unsubscribeFromChannel(channelId).then((response) =>{
            if (response) {
                alert("Unsubscribed from channel!");
                //change subscribed status
                let channel = findChannelFromId(channelId);
                channel.subscribed = false;
                setSqueals([...squeals]);
            }
        }).catch((error) => {
            alert("Error unsubscribing from channel!");
            console.log(error);
        });
    }

    return(
        <body>
            <header style={{position:'relative', top:'0', zIndex:'1', backgroundColor:'white'}}>
                <nav style={{ width:'100vw', display:"flex", paddingTop:'20px', flexFlow:"column", borderBottom: 'solid 2px #aaaaaa'}}>
                    <div style={{position:"relative"}}>
                        <h1 style={{margin: '0', textAlign:'center'}}>Squealer</h1>
                        <AddIcon onClick={handleChannelPopupVisibility} style={{color:"var(--primary)", cursor:"pointer", position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)"}}/>
                    </div>
                    <div id={"search-container"}>
                        <div aria-describedby={popId} onClick={handleClick} id="search-type-container">
                            <span>{searchTypeText}</span>
                            <KeyboardArrowDownRoundedIcon fontSize={"medium"} />
                        </div>
                        <Popover id={popId} open={open} anchorEl={anchorEl} onClose={handleClose} style={{borderRadius:'8px'}} anchorOrigin={{ vertical: 'bottom', horizontal: 'left',}}>
                            <div className={"search-type-popover"}>
                                <div onClick={() => {changeSearchType("text")}} className={"search-type-row"}>
                                    <Typography sx={{ p: 2 }}>aA</Typography>
                                    <Typography sx={{ p: 2 }}>Text</Typography>
                                </div>
                                <div onClick={() => {changeSearchType("channel")}} className={"search-type-row"}>
                                    <Typography sx={{ p: 2 }}>§</Typography>
                                    <Typography sx={{ p: 2 }}>Channel</Typography>
                                </div>
                                <div onClick={() => {changeSearchType("tag")}} className={"search-type-row"}>
                                    <Typography sx={{ p: 2 }}>#</Typography>
                                    <Typography sx={{ p: 2 }}>Tag</Typography>
                                </div>
                                <div onClick={() => {changeSearchType("user")}} className={"search-type-row"}>
                                    <Typography sx={{ p: 2 }}>@</Typography>
                                    <Typography sx={{ p: 2 }}>User</Typography>
                                </div>
                            </div>

                        </Popover>
                        <Autocomplete disablePortal disableClearable clearOnBlur={false} id="search-bar" options={[]} style={{ width: '85%' }}
                            renderInput={(params) => <TextField onChange={handleSearchTextChange} {...params} label="Search..." />}
                        />
                    </div>
                    <Stack style={{marginTop:'10px', padding:"0 10vw", marginBottom:'10px', justifyContent:'center'}} direction={'row'} spacing={1}>
                        <Chip label="Popular" />
                        <Chip label="Controversed" />
                    </Stack>
                    {
                        searchType !== "text" ?
                        <>
                            <Box sx={{ width: '100%', marginTop:'20px' }}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    variant="fullWidth"
                                    aria-label="secondary tabs example"
                                >
                                    {
                                        searchType !== "text" ?
                                            <Tab value="1" label="Content" />
                                            : null
                                    }
                                    {
                                        searchType !== "text" ?
                                            <Tab value="2" label="Posted" />
                                            : null
                                    }
                                    {
                                        searchType === "channel" ?
                                            <Tab value="3" label="List" />
                                            : null
                                    }
                                </Tabs>
                            </Box>
                        </> : null
                    }
                </nav>
            </header>

            <div>
                {
                    displaySearchType === "squeal" ?
                        squeals.map((squeal) => (
                            <>
                                <Squeal id={squeal._id}
                                        username={squeal.createdBy.username}
                                        reactions={squeal.reactions}
                                        avaiableReactions={avaiableReactions}
                                        content={squeal.content}
                                        mediaUrl={squeal.mediaUrl}
                                        mapPoints={squeal.mapPoints}
                                        variant={squeal.variant}
                                        type={squeal.contentType}
                                        moveToNewSqueal={moveToNewSqueal}
                                        channels={
                                            squeal.postedInChannels.map((channel) => (
                                                channel.name
                                            ))
                                        }/>
                                {
                                    squeal.replyTo != null ?
                                        <div style={{scale:'0.8', marginTop:'-20px'}}>
                                            <Typography style={{textAlign:'center'}}>Replyed to</Typography>
                                            <Squeal id={squeal.replyTo._id}
                                                    username={squeal.replyTo.createdBy.username}
                                                    reactions={squeal.replyTo.reactions}
                                                    avaiableReactions={avaiableReactions}
                                                    content={squeal.replyTo.content}
                                                    mediaUrl={squeal.replyTo.mediaUrl}
                                                    mapPoints={squeal.replyTo.mapPoints}
                                                    variant={squeal.replyTo.variant}
                                                    type={squeal.replyTo.contentType}
                                                    isReply={true}
                                                    moveToNewSqueal={moveToNewSqueal}
                                                    />
                                        </div>

                                    : null

                                }
                            </>
                        ))
                    :
                        <div className={"channels-list"}>
                            {
                                squeals.map((channel) => (
                                    <div className={"channel-row-container"}>
                                        <p>{channel.name}</p>
                                        <button className={channel.subscribed ? "channel-subscribed-button" : "channel-unsubscribed-button"} onClick={channel.subscribed ? () => { unsubscribeFromChannel(channel._id)} : () => { subscribeToChannel(channel._id)} }>{channel.subscribed ? "Unsubscribe" : "Subscribe"}</button>
                                    </div>
                                ))
                            }
                        </div>
                }
            </div>

            <CreateChannel closeFunction={handleChannelPopupVisibility} show={newChannelPopupVisibility}/>


        </body>
    );
}

//export the feed component
export default Feed;
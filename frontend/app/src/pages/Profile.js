import React, { useState, useEffect } from 'react';
import "../css/Profile.css";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import {Typography} from "@mui/material";
import ActionButton from "../components/ActionButton";

function Profile(props) {

    const [username, setUsername] = useState('');
    const [type, setType] = useState(0);
    useEffect(() => {
        window.getProfile().then((response) =>{
            console.log(response.data)
            setUsername(response.data.username);
            setType(response.data.type);
        });
    },[]);

    return(
        <body>
            <header>
                <nav id={"profile-nav"}>
                    <ArrowBackIosRoundedIcon style={{cursor:"pointer", fontSize:"1.6rem"}} color={"black"}/>
                    <Typography id={"user-name"} sx={{ p: 2 }}>@{username}</Typography>
                </nav>
            </header>
            <main>
                <div>
                    <div className={"karma-container"}>
                        <AutoAwesomeRoundedIcon style={{fontSize:"2.3rem", color:"var(--karma)"}}/>
                        <Typography style={{fontSize:'2rem', color:'var(--karma)', fontWeight:'bold'}}>{props.karma}pts.</Typography>
                    </div>
                    {
                        type > 0 ?
                            <Typography style={{fontSize:'1.3rem', color:'var(--primary)', textAlign:'center', marginTop:'20px', fontWeight:'bold'}}>{type == 1 ? "PRO" : "Moderator"} account</Typography>
                            : null
                    }
                    <div style={{backgroundColor: 'var(--light-bg)', transitionDuration:'0.3', width:'calc(100% - 30px - 20px)', margin: '20px 10px 0 10px', padding:'10px 15px', display:'flex', flexFlow:'column', gap:'10px', borderRadius:'10px'}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '1.2rem'}}>
                            <span>Daily characters left:</span>
                            <span style={{textAlign: 'end'}}>100</span>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '1.2rem'}}>
                            <span>Weekly characters left:</span>
                            <span style={{textAlign: 'end'}}>200</span>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '1.2rem'}}>
                            <span>Monthly characters left:</span>
                            <span style={{textAlign: 'end'}}>300</span>
                        </div>
                    </div>
                    {
                        type == 0 ?
                            <ActionButton classes={"profile-action-button"} text={"Go PRO"} type={"primary"}/>
                            : null
                    }
                    {
                        type > 0 ?
                            <ActionButton classes={"profile-action-button"} text={"Buy Characters"} type={"primary"}/>
                            : null
                    }
                    {
                        props.hasSMM ?
                            <ActionButton classes={"profile-action-button"} text={"Remove social media manager"} type={"danger"}/>
                            :
                            <ActionButton classes={"profile-action-button"} text={"Add a social media manager"} type={"primary"}/>
                    }
                </div>

                <div className={'universal-actions-container'}>
                    <ActionButton classes={"profile-action-button"} text={"Edit password"} type={"secondary"}/>
                    <ActionButton classes={"profile-action-button"} text={"Delete account"} type={"danger"}/>
                </div>

            </main>
        </body>
    );
}

export default Profile;
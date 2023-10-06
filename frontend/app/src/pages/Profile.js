import React, { useState, useEffect } from 'react';
import "../css/Profile.css";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import {Typography} from "@mui/material";
import ActionButton from "../components/ActionButton";

function Profile(props) {
    return(
        <body>
            <header>
                <nav>
                    <ArrowBackIosRoundedIcon style={{cursor:"pointer", fontSize:"1.6rem"}} color={"black"}/>
                    <Typography id={"user-name"} sx={{ p: 2 }}>@user</Typography>
                </nav>
            </header>
            <main>
                <div>
                    <div className={"karma-container"}>
                        <AutoAwesomeRoundedIcon style={{fontSize:"2.3rem", color:"var(--karma)"}}/>
                        <Typography style={{fontSize:'2rem', color:'var(--karma)', fontWeight:'bold'}}>{props.karma}pts.</Typography>
                    </div>
                    {
                        props.type === "pro" || props.type === "admin" ?
                            <Typography style={{fontSize:'1.3rem', color:'var(--primary)', textAlign:'center', marginTop:'20px', fontWeight:'bold'}}>PRO account</Typography>
                            : null
                    }
                    {
                        props.type === "base" ?
                            <ActionButton classes={"profile-action-button"} text={"Go PRO"} type={"primary"}/>
                            : null
                    }
                    {
                        props.type === "pro" || props.type === "admin" ?
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
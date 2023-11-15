import React, { useState, useEffect } from 'react';
import "../css/Profile.css";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import {Typography} from "@mui/material";
import ActionButton from "../components/ActionButton";

function Profile(props) {

    const [username, setUsername] = useState('');
    const [type, setType] = useState(props.type);
    const [dailyChars, setDailyChars] = useState(0);
    const [weeklyChars, setWeeklyChars] = useState(0);
    const [monthlyChars, setMonthlyChars] = useState(0);

    useEffect(() => {
        window.getProfile().then((response) =>{
            console.log(response.data)
            setUsername(response.data.username);
            setDailyChars(response.data.quota.dailyQuotaMax - response.data.quota.dailyQuotaUsed);
            setWeeklyChars(response.data.quota.weeklyQuotaMax - response.data.quota.weeklyQuotaUsed);
            setMonthlyChars(response.data.quota.monthlyQuotaMax - response.data.quota.monthlyQuotaUsed);
        });
    },[]);

    return(
        <body>
            <header>
                <nav id={"profile-nav"}>
                    <Typography style={{color: type === "guest" ? 'transparent' : "black"}} id={"user-name"} sx={{ p: 2 }}>@{username}</Typography>
                </nav>
            </header>
            <main>
                <div>
                    {
                        type === "prouser" || type === "moderator" ?
                            <Typography style={{fontSize:'1.3rem', color:'var(--primary)', textAlign:'center', marginTop:'20px', fontWeight:'bold'}}>{type.toString()} account</Typography>
                            : null
                    }
                    {
                        type !== "guest" ?
                            <div style={{backgroundColor: 'var(--light-bg)', transitionDuration:'0.3', width:'calc(100% - 30px - 20px)', margin: '20px 10px 0 10px', padding:'10px 15px', display:'flex', flexFlow:'column', gap:'10px', borderRadius:'10px'}}>
                                <div style={{display:'flex', justifyContent:'space-between', fontSize: '1.2rem'}}>
                                    <span>Daily characters left:</span>
                                    <span style={{textAlign: 'end'}}>{dailyChars}</span>
                                </div>
                                <div style={{display:'flex', justifyContent:'space-between', fontSize: '1.2rem'}}>
                                    <span>Weekly characters left:</span>
                                    <span style={{textAlign: 'end'}}>{weeklyChars}</span>
                                </div>
                                <div style={{display:'flex', justifyContent:'space-between', fontSize: '1.2rem'}}>
                                    <span>Monthly characters left:</span>
                                    <span style={{textAlign: 'end'}}>{monthlyChars}</span>
                                </div>
                            </div>
                        : null

                    }

                    {
                        type === "user" ?
                            <ActionButton classes={"profile-action-button"} text={"Go PRO"} type={"primary"}/>
                            : null
                    }
                    {
                        type === "prouser" ?
                            <>
                                <ActionButton classes={"profile-action-button"} text={"Buy Characters"} type={"primary"}/>
                                {
                                    props.hasSMM ?
                                        <ActionButton classes={"profile-action-button"} text={"Remove social media manager"} type={"danger"}/>
                                        :
                                        <ActionButton classes={"profile-action-button"} text={"Add a social media manager"} type={"primary"}/>
                                }
                            </>
                            : null
                    }
                </div>

                {
                    type !== "guest" ?
                        <div className={'universal-actions-container'}>
                            <ActionButton classes={"profile-action-button"} text={"Edit password"} type={"secondary"}/>
                            <ActionButton classes={"profile-action-button"} text={"Delete account"} type={"danger"}/>
                        </div>
                    :
                        <div className={'universal-actions-container'}>
                            <ActionButton redirect={"/static/auth"} classes={"profile-action-button"} text={"Login"} type={"primary"}/>
                        </div>
                }


            </main>
        </body>
    );
}

export default Profile;
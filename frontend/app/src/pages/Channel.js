import React, { useState, useEffect } from 'react';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded';
import {Typography} from "@mui/material";
import "../css/Channel.css";
import Squeal from "../components/Squeal";
function Channel(props) {

    const [muted, setMuted] = useState(props.muted);
    function handleNotifications() {
        setMuted(!muted);
    }

    const [subscribed, setSubscribed] = useState(props.subscribed);
    function handleSubscription() {
        setSubscribed(!subscribed);
    }

    return (
        <body>
            <header>
                <nav>
                    <div>
                        <ArrowBackIosRoundedIcon style={{cursor:"pointer", fontSize:"1.6rem"}} color={"black"}/>
                    </div>
                    <div style={{display:"flex", alignItems:'center'}}>
                        <div onClick={handleNotifications} style={{cursor:'pointer', display:'flex', alignItems:'center'}}>
                            {
                                muted ?
                                    <NotificationsOffRoundedIcon style={{fontSize:"1.6rem"}} color={"black"}/>
                                :
                                    <NotificationsRoundedIcon style={{fontSize:"1.6rem"}} color={"black"}/>
                            }
                        </div>

                        <Typography id={"channel-name"} sx={{ p: 2 }}>§public_ch</Typography>
                    </div>
                </nav>
                <button onClick={handleSubscription} className={ subscribed ? "unsubscription-button" : "subscription-button"}>
                    {
                        subscribed ?
                            "Unsubscribe"
                        :
                            "Subscribe"
                    }
                </button>
            </header>
            <main>
                <div className={"description-container"}>
                    <span className={"section-title"}>Description</span>
                    <span  style={{marginBottom:'20px'}} className={"description-content"}>oskdoksodksokdoskdoskdoskodksokdsokdoskdoskodksodkoskdosko kdfodjfs dif suhdosfhdosdf iodsufiodsufiosdoif udiosfu dsi ufodsoi fodsi ufoids ufiosd u fsdou fioudsoifu sdfo isdo fiosd ufo dfsuf  ufosdif esoidfio udiofdsiof dfo ids foid usfoids ufdis fod suoifsd fiods fdosf uoids f</span>
                    <span className={"section-title"}>Latest posts</span>
                </div>
                <div className={"squeal-container"}>
                    <Squeal username={"osguone"} reactions={[10, 10, 10, 10]} content={"<span>Che schifo quest'app</span>"} karma="112" type="text" tags={["test", "tag"]} channels={["public_ch", "PRIVATE_CH"]}/>
                </div>

            </main>
        </body>
    )
}

export default Channel
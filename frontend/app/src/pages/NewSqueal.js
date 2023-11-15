import Editor from '../components/Editor';
import ActionButton from "../components/ActionButton";
import {useEffect, useState} from "react";

function NewSqueal() {

    const [isLoading, setIsLoading] = useState(true);

    const [dailyChars, setDailyChars] = useState(10);
    const [weeklyChars, setWeeklyChars] = useState(0);
    const [monthlyChars, setMonthlyChars] = useState(0);

    window.getProfile().then((response) =>{
        setDailyChars(response.data.quota.dailyQuotaMax - response.data.quota.dailyQuotaUsed);
        setWeeklyChars(response.data.quota.weeklyQuotaMax - response.data.quota.weeklyQuotaUsed);
        setMonthlyChars(response.data.quota.monthlyQuotaMax - response.data.quota.monthlyQuotaUsed);
        setIsLoading(false);
    });

    return (
        <body>
        <header style={{position:'fixed', top:'0', zIndex:'1', backgroundColor:'white'}}>
            <nav style={{ width:'100vw', padding: '20px 0', borderBottom: 'solid 2px #aaaaaa'}}>
                <h1 style={{margin: '0', textAlign:'center'}}>New Squeal</h1>
            </nav>
        </header>
        {
            !isLoading ?
                <Editor day_max={dailyChars} week_max={weeklyChars} month_max={monthlyChars} />
            : null
        }
        </body>
    );




}

export default NewSqueal;
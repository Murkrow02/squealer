import React, { useState, useEffect } from 'react';
import "../css/Profile.css";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
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


    async function changePassword() {
        //get values
        let oldPassword = document.getElementById("old-pwd-input").value;
        let newPassword = document.getElementById("new-pwd-input").value;
        let confirmPassword = document.getElementById("confirm-pwd-input").value;

        if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
            alert("Please fill all the fields");
            return;
        }

        //check if new passwords match
        if(newPassword !== confirmPassword){
            alert("New passwords does not match");
            return;
        }

        //send request
        window.changePassword(oldPassword, newPassword).then((response) => {
            if (response) {
                alert("Password changed successfully");
                handleChangePasswordPopupVisibility();
            } else {
                alert(response.data.message);
            }
        }).catch((error) => {
            console.log(error);
            alert("Error changing password");
        });
    }



    const [changePasswordPopupVisibility, setChangePasswordPopupVisibility] = useState(false);
    function handleChangePasswordPopupVisibility() {
        setChangePasswordPopupVisibility(!changePasswordPopupVisibility);
    }


    const [searchSMMOverlayVisibility, setSearchSMMOverlayVisibility] = useState(false);
    function handleSearchSMMOverlayVisibility() {
        setSearchSMMOverlayVisibility(!searchSMMOverlayVisibility);
    }

    const [smmList, setSmmList] = useState([]);
    function smmSearchInputChanged(event) {

        let value = event.target.value;

        window.searchByUsername(value, "smm").then((response) => {
            console.log(response.data);
            setSmmList(response.data);
        }).catch((error) => {
            console.log(error);
            alert("Error searching SMM");
        });
    }

    const [hasSMM, setHasSMM] = useState(!!props.smm);
    function addSmm(smmId) {
        window.setSmm(smmId).then((response) => {
            console.log(response.data);
            alert("SMM added successfully");
            window.location.reload();
            // setHasSMM(true);
            // handleSearchSMMOverlayVisibility();
        }).catch((error) => {
            console.log(error);
            alert("Error adding SMM");
        });
    }

    function removeSmm() {
        window.removeSmm().then((response) => {
            console.log(response.data);
            setHasSMM(false);
            alert("SMM removed successfully");
        }).catch((error) => {
            console.log(error);
            alert("Error removing SMM");
        });
    }

    async function deleteAccount() {

        let confirm = window.confirm("Are you sure you want to delete your account?");
        if (!confirm) {
            return;
        }

        window.deleteAccount().then((response) => {
            if (response) {
                alert("Account deleted successfully");
                window.location.href = "/static/auth";
            } else {
                alert(response.data.message);
            }
        });
    }


    async function goPro() {
        let confirm = window.confirm("500€ will be charged from your account. Are you sure you want to go PRO?");

        if (!confirm) {
            return;
        }

        window.goPro().then((response) => {
            if (response) {
                alert("Account upgraded successfully");
                setType("prouser");
            } else {
                alert(response.data.message);
            }
        }).catch((error) => {
            console.log(error);
            alert("Error upgrading account");
        });
    }

    function logout() {
        //remove item from local storage
        localStorage.removeItem("token");
        window.location.href = "/static/auth";
    }

    let style = {};
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
                            <ActionButton onClick={goPro} classes={"profile-action-button"} text={"Go PRO"} type={"primary"}/>
                            : null
                    }
                    {
                        type === "prouser" ?
                            <>
                            {/*<ActionButton classes={"profile-action-button"} text={"Buy Characters"} type={"primary"}/>*/}
                            {
                                hasSMM ?
                                    <div>
                                        <Typography style={{fontSize:'1.3rem', color:'var(--primary)', textAlign:'center', marginTop:'20px', fontWeight:'bold'}}>SMM: @{props.smm.username}</Typography>
                                        <ActionButton onClick={removeSmm} classes={"profile-action-button"} text={"Remove social media manager"} type={"danger"}/>
                                    </div>
                                    :
                                    <ActionButton onClick={handleSearchSMMOverlayVisibility} classes={"profile-action-button"} text={"Add a social media manager"} type={"primary"}/>
                            }
                            </>
                            : null
                    }
                </div>

                {
                    type !== "guest" ?
                        <div className={'universal-actions-container'}>
                            <ActionButton onClick={handleChangePasswordPopupVisibility} classes={"profile-action-button"} text={"Edit password"} type={"secondary"}/>
                            <ActionButton onClick={logout} classes={"profile-action-button"} text={"Logout"} type={"danger"}/>
                            <ActionButton onClick={deleteAccount} classes={"profile-action-button"} text={"Delete account"} type={"danger"}/>
                        </div>
                    :
                        <div className={'universal-actions-container'}>
                            <ActionButton redirect={"/static/auth"} classes={"profile-action-button"} text={"Login"} type={"primary"}/>
                        </div>
                }

                <div style={{display: changePasswordPopupVisibility ? "flex" : "none"}} className={"change-pwd-overlay"}>
                    <div className={"change-pwd-container"}>
                        <p className={"change-pwd-title"}>Change password</p>
                        <div className={"change-pwd-form"} >
                            <input id={"old-pwd-input"} name={"oldPassword"} type={"password"} placeholder={"Old password"}/>
                            <input id={"new-pwd-input"} name={"newPassword"} type={"password"} placeholder={"New password"}/>
                            <input id={"confirm-pwd-input"} name={"confirmPassword"} type={"password"} placeholder={"Confirm new password"}/>
                            <div className={"change-pwd-buttons"}>
                                <button onClick={handleChangePasswordPopupVisibility} className={"change-pwd-cancel"}>Cancel</button>
                                <button onClick={changePassword} className={"change-pwd-confirm"}>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>


                <div style={{display: searchSMMOverlayVisibility ? "flex" : "none"}} className={"search-smm-overlay"}>
                    <div className={"search-smm-container"}>
                        <p className={"change-pwd-title"}>Search SMM</p>

                        <input id={"search-smm-input"} onChange={smmSearchInputChanged} type={"search"} placeholder={"Search"}></input>
                        <div className={"search-smm-list"}>
                            {
                                smmList.map((smm) => {
                                    return(
                                        <div onClick={() => {addSmm(smm._id)}} className={"smm-card"}>
                                            <div className={"smm-card-header"}>
                                                <div className={"smm-card-header-left"}>
                                                    <p>{smm.username}</p>
                                                </div>
                                                <div className={"smm-card-header-right"}>
                                                    <ArrowForwardIcon style={{color: "var(--primary)"}}/>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <CloseIcon onClick={handleSearchSMMOverlayVisibility} className={"search-smm-close-button"}></CloseIcon>
                    </div>
                </div>
            </main>
        </body>
    );
}

export default Profile;
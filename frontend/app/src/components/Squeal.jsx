import * as React from 'react';
import AddReactionRoundedIcon from '@mui/icons-material/AddReactionRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {Popover} from "@mui/material";
import {useEffect} from "react";

export default function Squeal(props) {

    const [reactionPopoverAnchorEl, setReactionPopoverAnchorEl] = React.useState(null);

    const [avaiableReactions, setAvaiableReactions] = React.useState([]);
    const [reactions, setReactions] = React.useState([]);

    useEffect(() => {
        setAvaiableReactions(props.avaiableReactions);
        setReactions(props.reactions);
    }, []);
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

                        : null
                    }
                </div>
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
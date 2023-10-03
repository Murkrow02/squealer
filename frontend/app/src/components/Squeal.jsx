import * as React from 'react';
import AddReactionRoundedIcon from '@mui/icons-material/AddReactionRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import {Popover} from "@mui/material";

const reactions = ["&#128525;", "&#128077;", "&#128545;", "&#128078;"]

export default function Squeal(props) {

    const [anchorEl, setAnchorEl] = React.useState(null);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return(
        <div style={{width: '100vw', marginTop: '10px', position:'relative', zIndex:'0' , display:'flex', justifyContent:'center'}}>
            <div style={{width: '90vw', borderRadius:'10px', boxShadow:'0 0 42px -4px rgba(0,0,0,0.24)', height: 'fit-content', padding:'15px', backgroundColor:"white",}}>
                <div style={{display:'flex', gap:"5px"}}>
                    <span>Posted by</span>
                    <span style={{fontWeight:"bold"}}>@{props.username}</span>
                    <span style={{color: 'var(--karma)', fontWeight:"bold"}}>{props.karma}pts.</span>
                </div>
                <div style={{display:'flex', gap:"8px", marginTop:"10px"}}>
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
                    {props.type === "text" && (
                        <div style={{ backgroundColor:'var(--light-bg)', width: '95%', borderRadius:'10px', height:'fit-content', padding:'10px'}}>
                            <div dangerouslySetInnerHTML={{ __html: props.content }} />
                            {props.content.length > 2 && (
                                <div style={{display:'flex', justifyContent:'flex-end'}}>
                                    <span style={{color:'var(--primary)', cursor:'pointer'}}>Read more...</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div style={{display:'flex', gap:"8px", marginTop:"10px"}}>
                    {props.reactions.map((reaction, index) => {
                        return(
                            <div style={{backgroundColor:'var(--light-bg)', padding:'5px', borderRadius:'10px', display:'flex', gap:'3px'}}>
                                <span dangerouslySetInnerHTML={{ __html: reactions[index] }}></span>
                                <span style={{fontWeight:"bold"}} key={index}>{reaction}</span>
                            </div>
                        )
                    })}
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:"20px", marginTop:'20px'}}>
                    <div aria-describedby={id} onClick={handleClick} style={{backgroundColor:"white", padding:"10px", cursor:'pointer', gap:'5px', alignItems:'center', borderRadius:'10px', boxShadow:'0 0 42px -4px rgba(0,0,0,0.16)', display:'flex', justifyContent:'center'}}>
                        <AddReactionRoundedIcon style={{color:'var(--text-light)'}}/>
                        <span style={{color:"var(--text-light)"}}>React</span>
                    </div>
                    <Popover elevation={5} id={id} open={open} anchorEl={anchorEl} onClose={handleClose}
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
                            {reactions.map((reaction, index) => {
                                return(
                                    <div style={{ padding:'5px', borderRadius:'10px', cursor:'pointer', display:'flex', gap:'3px'}}>
                                        <span style={{fontSize:'1.5rem'}} dangerouslySetInnerHTML={{ __html: reaction }}></span>
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
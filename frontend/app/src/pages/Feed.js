
//basic react imports
import React, { useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Squeal from '../components/Squeal';

function Feed() {

    const [squeals, setSqueals] = useState([]);
    useEffect(() => {
        window.getAllSqueals().then((response) =>{
            console.log(response.data)
            setSqueals(response.data)
        });
    },[]);

    return(
        <body>
            <header style={{position:'fixed', top:'0', zIndex:'1', backgroundColor:'white'}}>
                <nav style={{ width:'100vw', padding: '20px 0', borderBottom: 'solid 2px #aaaaaa'}}>
                    <h1 style={{margin: '0', textAlign:'center'}}>Squealer</h1>
                    <search style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                        <input type="text" placeholder="Cerca" style={{width: '80vw', maxWidth: '500px', padding: '10px', borderRadius: '5px', border: 'solid 1px #aaaaaa'}}/>
                    </search>
                    <Stack style={{marginTop:'10px', padding:"0 10vw", justifyContent:'center'}} direction={'row'} spacing={1}>
                        <Chip label="Popular" />
                        <Chip label="Controversed" />
                    </Stack>
                </nav>
            </header>

            <div style={{marginTop: '20vh',}}>
                {squeals.map((squeal) => (
                    <Squeal username={squeal.createdBy.username} reactions={[10, 10, 10, 10]} content={squeal.content} karma="112" type="text" tags={["test", "tag"]} channels={["public_ch", "PRIVATE_CH"]}/>
                ))}
            </div>
        </body>
    );
}

//export the feed component
export default Feed;
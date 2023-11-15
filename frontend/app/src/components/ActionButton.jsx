import React, { useState, useEffect } from 'react';


export default function ActionButton(props) {

    let color = 'white';
    let backgroundColor = 'var(--primary)';
    switch (props.type) {
        case 'primary':
            color = 'white';
            backgroundColor = 'var(--primary)';
            break;
        case 'secondary':
            color = 'var(--primary)';
            backgroundColor = 'var(--light-bg)';
            break;
        case 'danger':
            color = 'white';
            backgroundColor = 'var(--danger)';
            break;
        default:
            color = 'white';
            backgroundColor = 'var(--primary)';
    }

    function buttonClick() {
        if (props.redirect && props.redirect !== "") {
            window.location.href = props.redirect;
        }
    }


    return(
        <button onClick={buttonClick} className={props.classes} style={{width:'calc(100% - 20px)', border:'none', borderRadius:'10px', padding:'15px 0', fontWeight:'bold', fontSize:'1.2rem', cursor:'pointer', marginLeft:'10px', marginRight:'10px',
            color:color,
            backgroundColor: backgroundColor}}>
            {props.text}
        </button>
    );
}
import React, { useState, useEffect } from 'react';


class CreateChannel extends React.Component {
    state = {show: this.props.show};
    updateAndNotify = () => {
        this.setState({show: this.props.show});
        //refresh component
        this.forceUpdate();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("prevProps", prevProps);
        console.log("this.props", this.props);
        if (prevProps.show !== this.props.show) {
            this.updateAndNotify();
        }
    }

    createChannel = () => {

        //get input values
        let channelName = document.getElementById("channel-name-input").value;
        let channelDesc = document.getElementById("channel-desc-input").value;

        //check input are not empty
        if (channelName === "" || channelDesc === "") {
            alert("Please fill in all fields");
            return;
        }

        //check if there are spaces in channel name
        if (channelName.includes(" ")) {
            alert("Channel name cannot contain spaces or special characters");
            return;
        }


        window.createChannel(channelName, channelDesc).then((res) => {
            console.log(res);
            if (res) {
                alert("Channel created successfully");
                this.closePopup();
            }

        }).catch((err) => {
            console.log(err);
        });
    }

    closePopup = () => {
        //clear fields
        document.getElementById("channel-name-input").value = "";
        document.getElementById("channel-desc-input").value = "";

        this.props.closeFunction();
    }

    render() {
        return(
            <div style={{display: this.state.show ? "flex" : "none"}} className={"create-channel-overlay"} >
                <div className={"create-channel-container"}>
                    <p className={"create-channel-title"}>Create channel</p>
                    <div className={"create-channel-input-container"}>
                        <input id={"channel-name-input"} placeholder={"Channel name"}/>
                        <textarea id={"channel-desc-input"} placeholder={"Channel description"}/>
                        <button onClick={() => { this.createChannel() }} className={"create-channel-confirm"}>Create</button>
                        <button onClick={this.closePopup} className={"create-channel-dismiss"}>Dismiss</button>
                    </div>
                </div>
            </div>
        )
    }

}

export default CreateChannel;
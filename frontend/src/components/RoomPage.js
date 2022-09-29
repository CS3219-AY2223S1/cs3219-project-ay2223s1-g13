import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    TextField,
    Typography,
    Grid
} from "@mui/material";
import Question from "./Question/Question";
import io from 'socket.io-client';
import React, { useEffect, useState } from "react";


function RoomPage() {
    const socket = io('http://localhost:8003');
    const [userCode, setUserCode] = useState(""); 

    const [isFirstConnect, setIsFirstConnect] = useState(true);

    useEffect(() => {
        if (isFirstConnect) {
            socket.emit("joinRoom", {roomId: sessionStorage.getItem("roomId")});
        }
        setIsFirstConnect(false);
    });

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    socket.on("receive code", (data) => {
        setUserCode(data)
    })

    const sendToSocket =  () => {
        setUserCode(document.getElementById('textbox').value)
        const code = document.getElementById('textbox').value
        socket.emit("send code", {roomId: sessionStorage.getItem("roomId"), text: code}) 
    }; 

    return (
        <Grid container spacing={2}>
            <Grid item>
                <Question/>
            </Grid>
            <Grid item>
                <TextField multiline rows={20} value={userCode} id="textbox" variant="outlined" onChange={sendToSocket} style = {{width: 500}}/>
            </Grid>
        </Grid>
    );
}

export default RoomPage;

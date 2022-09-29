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
    const [element, setElement] = useState(null);
    const [userCode, setUserCode] = useState(""); 


    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
      );

    useEffect(() => {
        setElement(document.getElementById('textbox'));
        socket.on("message", (data) => {
            setUserCode(data)
        })
    });

    const sendToSocket =  () => {
        setUserCode(element.value)
        const text = element.value
        socket.emit("message", text) 
    }; 

    return (
        <Grid container spacing={2}  >
            <Grid>
            <Question/>
            </Grid>
            <Grid>
            <TextField multiline rows={20} value={userCode} id="textbox" variant="outlined" onChange={sendToSocket} style = {{width: 500}}/>
            </Grid>
        </Grid>
    );
}

export default RoomPage;

import {
    Grid,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Question from "./Question/Question";
import io from 'socket.io-client';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RoomPage() {
    const socket = io('http://localhost:8003');
    const navigate = useNavigate();

    const [userCode, setUserCode] = useState(""); 
    const [isFirstConnect, setIsFirstConnect] = useState(true);

    useEffect(() => {
        if (isFirstConnect) {
            socket.emit("join room", {roomId: sessionStorage.getItem("roomId")});
        }
        setIsFirstConnect(false);
    });

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    socket.on("receive code", (data) => {
        setUserCode(data)
    });

    socket.on("partner exit", () => {
        sessionStorage.removeItem('roomId');
        navigate('/home');
    });

    const sendToSocket = () => {
        setUserCode(document.getElementById('textbox').value)
        const code = document.getElementById('textbox').value
        socket.emit("send code", {roomId: sessionStorage.getItem("roomId"), text: code}) 
    }; 

    const handleExit = () => {
        socket.emit("exit", {roomId: sessionStorage.getItem("roomId")});
        sessionStorage.removeItem('roomId');
        navigate('/home');
    }

    return (
        <Grid container spacing={5}>
            <Grid item>
                <IconButton onClick={handleExit}>
                    <ArrowBackIosIcon/>
                    <Typography variant='h5'>Exit</Typography>
                </IconButton>
                <Question/>
            </Grid>
            <Grid item>
                <TextField multiline rows={20} value={userCode} id="textbox" variant="outlined" onChange={sendToSocket} style = {{width: 500}}/>
            </Grid>
        </Grid>
    );
}

export default RoomPage;

import {
    Button,
    Dialog,
    DialogContent,
    Grid,
    IconButton,
    TextField,
    Stack,
    Typography
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Question from "./Question/Question";
import io from 'socket.io-client';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";

function RoomPage() {
    const socket = io('http://localhost:8003');
    const navigate = useNavigate();

    const [userCode, setUserCode] = useState(""); 
    const [isFirstConnect, setIsFirstConnect] = useState(true);
    const [exitDialogOpen, setExitDialogOpen] = useState(false);
    const [partnerExitedDialogOpen, setPartnerExitedDialogOpen] = useState(false);

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
        setPartnerExitedDialogOpen(true);
    });

    const sendToSocket = () => {
        setUserCode(document.getElementById('textbox').value)
        const code = document.getElementById('textbox').value
        socket.emit("send code", {roomId: sessionStorage.getItem("roomId"), text: code}) 
    }; 

    const handleFirstExit = () => {
        socket.emit("exit", {roomId: sessionStorage.getItem("roomId")});
        sessionStorage.removeItem('roomId');
        navigate('/home');
    }

    const handleSecondExit = () => {
        sessionStorage.removeItem('roomId');
        navigate('/home');
    }

    return (
        <Box>
            <Grid container spacing={5}>
                <Grid item>
                    <IconButton onClick={() => setExitDialogOpen(true)}>
                        <ArrowBackIosIcon/>
                        <Typography variant='h5'>Exit</Typography>
                    </IconButton>
                    <Question/>
                </Grid>
                <Grid item>
                    <TextField multiline rows={20} value={userCode} id="textbox" variant="outlined" onChange={sendToSocket} style = {{width: 500}}/>
                </Grid>
            </Grid>

            <Dialog open = {exitDialogOpen} onClose = {() => setExitDialogOpen(false)}>
                <DialogContent>
                    <Stack display='flex' alignItems='center' spacing={2}>
                        <Typography variant='body1'>Are you sure you want to exit?</Typography>
                        <Stack direction='row' spacing={3}>
                            <Button variant='contained' onClick={() => setExitDialogOpen(false)}>Cancel</Button>
                            <Button variant='contained' onClick={handleFirstExit} color='error'>Exit</Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog> 

            <Dialog open = {partnerExitedDialogOpen} onClose = {(e, r) => {if (r != "backdropClick") { navigate('/home') }}}>
                <DialogContent>
                    <Stack display='flex' alignItems='center' spacing={2}>
                        <Typography variant='body1'>The other user has exited!</Typography>
                        <Button variant='contained' onClick={handleSecondExit}>Exit</Button>
                    </Stack>
                </DialogContent>
            </Dialog> 
        </Box>
    );
}

export default RoomPage;

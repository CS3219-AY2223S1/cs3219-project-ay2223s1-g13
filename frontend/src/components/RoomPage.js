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
import CodeEditor from "./CodeEditor";
import io from 'socket.io-client';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import { fetchQuestion } from "./Question/api";

import "./RoomPage.css"

function RoomPage() {
    const socket = io('http://localhost:8003');
    const navigate = useNavigate();

    const [userCode, setUserCode] = useState("");
    const [isFirstConnect, setIsFirstConnect] = useState(true);
    const [exitDialogOpen, setExitDialogOpen] = useState(false);
    const [partnerExitedDialogOpen, setPartnerExitedDialogOpen] = useState(false);
    const [questionA, setQuestionA] = useState({});
    const [questionB, setQuestionB] = useState({});
    const [isASet, setIsASet] = useState(false);
    const [isBSet, setIsBSet] = useState(false);
    const [question, setQuestion] = useState({});

    useEffect(() => {
        if (isFirstConnect) {
            socket.emit("join room", { roomId: sessionStorage.getItem("roomId") });
        }
        setIsFirstConnect(false);
    }, [isFirstConnect, socket]);

    useEffect(() => {
        const _fetchQuestion = async (difficulty) => {
            const res = await fetchQuestion(difficulty);
            return res;
        };

        if (!isASet) {
            _fetchQuestion(sessionStorage.getItem("difficulty")).then((ques) => {
                setQuestionA(ques)
                socket.emit("exchange question", { roomId: sessionStorage.getItem("roomId"), question: ques });
            })
        }
        setIsASet(true);

        if (!isBSet) {
            exchangeQuestion();
            receiveQuestion();
        }
        setIsBSet(true);

        if (isASet && isBSet) {
            if (questionA.id > questionB.id) {
                setQuestion(questionA);
            } else {
                setQuestion(questionB);
            }
        }
    }, [questionA, questionB])

    socket.on("receive code", (data) => {
        setUserCode(data)
    });

    const receiveQuestion = () => {
        socket.on("receive other question", (data) => {
            setQuestionB(data);
        })
        if (questionB !== {}) {
            setIsBSet(true)
        }
    }

    socket.on("partner exit", () => {
        setPartnerExitedDialogOpen(true);
    });

    const exchangeQuestion = () => {
        socket.emit("exchange question", { roomId: sessionStorage.getItem("roomId"), question: questionA });
    }

    const sendToSocket = () => {
        setUserCode(document.getElementById('textbox').value)
        const code = document.getElementById('textbox').value
        socket.emit("send code", { roomId: sessionStorage.getItem("roomId"), text: code })
    };

    const handleFirstExit = () => {
        socket.emit("exit", { roomId: sessionStorage.getItem("roomId") });
        sessionStorage.removeItem('roomId');
        navigate('/home');
    }

    const handleSecondExit = () => {
        sessionStorage.removeItem('roomId');
        navigate('/home');
    }

    const section = {
        width:"210%",
        paddingTop: 5,
        backgroundColor: "#fff"
      };

    return (
        <Box>
            <IconButton onClick={() => setExitDialogOpen(true)}>
                <ArrowBackIosIcon />
                <Typography variant='h5'>Exit</Typography>
            </IconButton>
            <Grid container spacing={5}>
                <Grid item>
                    <Question {...question} />
                </Grid>
                <Grid item>
                    <div style={section}><CodeEditor room_id={sessionStorage.getItem("roomId")} style={{ width: 500 }}></CodeEditor></div>
                </Grid>
            </Grid>


            <Dialog open={exitDialogOpen} onClose={() => setExitDialogOpen(false)}>
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

            <Dialog open={partnerExitedDialogOpen} onClose={(e, r) => { if (r !== "backdropClick") { navigate('/home') } }}>
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

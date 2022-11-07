import {
    Button,
    Dialog,
    DialogContent,
    Grid,
    IconButton,
    Stack,
    TextField,
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
import axios from "axios";
import { URL_HISTORY_SVC } from "../configs";

import { Widget, addResponseMessage, dropMessages, isWidgetOpened, toggleWidget, renderCustomComponent } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

function RoomPage() {
    const socket = io('https://collaboration-service-4crgpcigjq-uc.a.run.app');
    const matchsocket = io("wss://matching-service-au7tawfmmq-uc.a.run.app", { transports: ['websocket'] });
    const navigate = useNavigate();

    const [isFirstConnect, setIsFirstConnect] = useState(true);
    const [exitDialogOpen, setExitDialogOpen] = useState(false);
    const [partnerExitedDialogOpen, setPartnerExitedDialogOpen] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [chosenQuestion, setChosenQuestion] = useState(0);

    useEffect(() => {
        if (isFirstConnect) {
            socket.emit("join room", { roomId: sessionStorage.getItem("roomId") });
        }
        setIsFirstConnect(false);
    }, [isFirstConnect, socket]);

    useEffect(() => {
        const _fetchQuestions = async (ids) => {
            const firstQuestion = await fetchQuestion(ids[0]);
            const secondQuestion = await fetchQuestion(ids[1]);
            setQuestions([firstQuestion, secondQuestion]);
        };

        const ids = sessionStorage.getItem("questionIds").split(",");
        _fetchQuestions(ids);

       
    }, [])

    const updateHistory = async (question) => {
        const room_id = sessionStorage.getItem("roomId");
        const usernames = room_id.split("_");
        const difficulty = sessionStorage.getItem("difficulty");
        const questionName = question.title;
        const questionId = question.id;
        await axios.post(URL_HISTORY_SVC, {
            username: usernames[0], 
            matchedUsername: usernames[1],
            difficulty,
            question: questionName,
            questionId
        })
        await axios.post(URL_HISTORY_SVC, {
            username: usernames[1], 
            matchedUsername: usernames[0],
            difficulty,
            question: questionName,
            questionId
        })
    }

    socket.on("partner exit", () => {
        setPartnerExitedDialogOpen(true);
        if (isWidgetOpened()) {
            toggleWidget();
        }
    });

    const handleExit = () => {
        if (isWidgetOpened()) {
            toggleWidget();
        }
        setExitDialogOpen(true);
    }

    const handleFirstExit = () => {
        socket.emit("exit", { roomId: sessionStorage.getItem("roomId") });
        removeMatch();
        dropMessages();
        sessionStorage.removeItem('roomId');
        navigate('/home');
    }

    const handleSecondExit = () => {
        removeMatch();
        dropMessages();
        sessionStorage.removeItem('roomId');
        navigate('/home');
    }

    const removeMatch = () => {
        matchsocket.emit('removematch', { user: sessionStorage.getItem("username") });
    }

    const displayQuestions = () => {
        return (
            <div>
                <div style={{display: "flex", justifyContent: "space-around", alignItems:"flex-end"}}>
                    <div className={`question_selector  ${chosenQuestion == 0 ? "question_selector_selected":""}`} 
                        onClick={() => setChosenQuestion(0)}
                    >
                        # 1
                    </div>
                    <div className={`question_selector ${chosenQuestion == 1 ? "question_selector_selected":""}`} 
                        onClick={() => setChosenQuestion(1)}
                    >
                        # 2
                    </div>
                </div>
                <Question {...questions[chosenQuestion]} />
            </div>
        )
    }

    const handleNewUserMessage = (newMessage) => {
        socket.emit('sendmessage', { 
            roomId: sessionStorage.getItem("roomId"), 
            sender: sessionStorage.getItem("username"),
            message: newMessage 
        });
    }

    socket.on("receivemessage", (params) => {
        if (params.sender !== sessionStorage.getItem("username")) {
            addResponseMessage(params.message);
        }
    })

    return (
        <Box>
            <IconButton onClick={handleExit}>
                <ArrowBackIosIcon />
                <Typography variant='h5'>Exit</Typography>
            </IconButton>
            <Stack pt={2}>
                {   questions.length > 1 && 
                    displayQuestions()
                }
                <CodeEditor room_id={sessionStorage.getItem("roomId")} ></CodeEditor>
            </Stack>

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

            <Widget 
                handleNewUserMessage={handleNewUserMessage}
                title="Chat"
                subtitle="Discuss the question here!"
                emojis={true}
            />
        </Box>
    );
}

export default RoomPage;

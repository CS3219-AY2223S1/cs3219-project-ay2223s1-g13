import {
    Button,
    Dialog,
    DialogContent,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Question from "./Question/Question";
import io from 'socket.io-client';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import { fetchQuestion } from "./Question/api";

import "./RoomPage.css"

import { Widget, addResponseMessage, dropMessages, isWidgetOpened, toggleWidget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { WebrtcProvider } from 'y-webrtc';

function RoomPage() {
    const socket = io('https://collaboration-service-4crgpcigjq-uc.a.run.app');
    const matchsocket = io("wss://matching-service-au7tawfmmq-uc.a.run.app", { transports: ['websocket'] });
    const navigate = useNavigate();

    const [isFirstConnect, setIsFirstConnect] = useState(true);
    const [exitDialogOpen, setExitDialogOpen] = useState(false);
    const [partnerExitedDialogOpen, setPartnerExitedDialogOpen] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [chosenQuestion, setChosenQuestion] = useState(0);

    let reactQuillRef = null;
    const provider = React.useRef(null);
    const quillRef = React.useRef(null);

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
        cleanUp();
        navigate('/home');
    }

    const handleSecondExit = () => {
        removeMatch();
        cleanUp();
        navigate('/home');
    }

    const cleanUp = () => {
        removeMatch();
        dropMessages();
        socket.emit("end");
        provider.current.destroy();
        sessionStorage.removeItem('roomId');
        sessionStorage.removeItem('questionIds');
        sessionStorage.removeItem('difficulty');
    }

    const removeMatch = () => {
        matchsocket.emit('removematch', { user: sessionStorage.getItem("username") });
    }

    const displayQuestions = () => {
        return (
            <div>
                <div style={{display: "flex", justifyContent: "space-around", alignItems:"flex-end"}}>
                    <div className={`question_selector  ${chosenQuestion === 0 ? "question_selector_selected":""}`} 
                        onClick={() => setChosenQuestion(0)}
                    >
                        # 1
                    </div>
                    <div className={`question_selector ${chosenQuestion === 1 ? "question_selector_selected":""}`} 
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

    React.useEffect(() => {
        quillRef.current = reactQuillRef.getEditor();
        const ydoc = new Y.Doc()
        const ytext = ydoc.getText('quill')
        new QuillBinding(ytext, quillRef.current)
        provider.current = new WebrtcProvider(sessionStorage.getItem("roomId"), ydoc)
    }, [reactQuillRef, provider])

    const editorModules = {
        toolbar: [
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike',],
            [
                { indent: '-1' },
                { indent: '+1' },
            ],
        ]
    }

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
                <ReactQuill ref={e => { reactQuillRef = e }} theme={'snow'} modules={editorModules} />
            </Stack>

            <Dialog open={exitDialogOpen} onClose={() => setExitDialogOpen(false)}>
                <DialogContent>
                    <Stack display='flex' alignItems='center' spacing={2}>
                        <Typography variant='body1'>Are you sure you want to exit?</Typography>
                        <Stack>
                            <Button variant='contained' onClick={handleFirstExit} color='error'>Exit</Button>
                            <Button onClick={() => setExitDialogOpen(false)} color="inherit">Cancel</Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>

            <Dialog open={partnerExitedDialogOpen} onClose={(e, r) => { if (r !== "backdropClick") { navigate('/home') } }}>
                <DialogContent>
                    <Stack display='flex' alignItems='center' spacing={2}>
                        <Typography variant='body1'>The other user has exited!</Typography>
                        <Button color="error" variant='contained' onClick={handleSecondExit}>Exit</Button>
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

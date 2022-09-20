import { useState } from "react";

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    fabClasses,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import DifficultySelectorCard from "./DifficultySelectorCard";
import { difficulties } from "../../../constants";
import { useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./DifficultySelector.css";
import { URL_MATCHING } from "../../../configs";
import { Navigate, useNavigate } from "react-router-dom";

function DifficultySelector() {
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState("")
    const [dialogTitle, setDialogTitle] = useState("")
    const [isMatchedDialogOpen, setMatchedDialogOpen] = useState(false)
    const navigate = useNavigate()
    const socket = io("ws://localhost:8001", {transports: ['websocket']});
    


    const startMatching = () => {
        var userDetails = {
            "userOne": sessionStorage.getItem("username"),
            "difficulty": "Easy"
        }
        socket.emit('match', userDetails); 
        setWaitingDialog("Waiting for match")
        socket.on('matchSuccess', (...args) => {
            setDialogMsg(false)
            setMatchedDialog("Connected!")   
        })
    }

    const onClickDifficulty = async (clickedDifficulty) => {
        setSelectedDifficulty(clickedDifficulty);
        startMatching()
        console.log("running here")
    };

    const closeMatchDialog = () => {
        setMatchedDialog(false)
        navigate('/room')
    }

    const closeDialog = () => setDialogOpen(false) 

    const setMatchedDialog = (msg) => {
        setMatchedDialogOpen(true)
        setDialogTitle('Match Set')
        setDialogMsg(msg)
    }

    const setWaitingDialog = (msg) => {
        setDialogOpen(true)
        setDialogTitle('Waiting for match')
        setDialogMsg(msg)
    }

    return (
        <Box> 
            <div classname="difficultySelector_container">
                <div className="difficultySelector_body">
                    {difficulties.map((difficulty) => {
                        return (
                            <div
                                onClick={() => onClickDifficulty(difficulty)}
                                key={difficulty}
                            >
                                <DifficultySelectorCard
                                    difficulty={difficulty}
                                    isSelected={difficulty === selectedDifficulty}
                                />

                            </div>
                        );
                    })}
                </div>
            </div>
            <Dialog open={isDialogOpen}
                onClose={closeDialog}>  
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Close</Button>
                </DialogActions>
            </Dialog>     

            <Dialog open = {isMatchedDialogOpen}
                onClose = {closeMatchDialog}>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={closeMatchDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>      
    );
}

export default DifficultySelector;

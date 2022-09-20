import { useState } from "react";

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
    Typography
} from "@mui/material";

import DifficultySelectorCard from "./DifficultySelectorCard";
import { difficulties } from "../../../constants";
import { useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./DifficultySelector.css";
import { URL_MATCHING } from "../../../configs";

function DifficultySelector() {
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState("")
    const [dialogTitle, setDialogTitle] = useState("")


    const startMatching = () => {
        const socket = io("ws://localhost:8001");
        var userDetails = {
            "userOne": sessionStorage.getItem("username"),
            "difficulty": selectedDifficulty
        }
        socket.emit('match', userDetails); 
        startListener(socket); 
    }

    const startListener = (socket) => {
        socket.on('match', (...args) => {
            setWaitingDialog("args")
          });    
    }


    const onClickDifficulty = (clickedDifficulty) => {
        setSelectedDifficulty(clickedDifficulty);
        startMatching(); 
    };

    const closeDialog = () => setDialogOpen(false)

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
        </Box>      
    );
}

export default DifficultySelector;

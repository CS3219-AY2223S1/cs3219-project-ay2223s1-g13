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
    
}

export default DifficultySelector;

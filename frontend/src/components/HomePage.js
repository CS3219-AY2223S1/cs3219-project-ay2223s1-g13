import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { URL_USER_SVC, URL_LOGIN_SVC, URL_CHECK_TOKEN } from "../configs";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED, STATUS_OK, STATUS_BAD_REQUEST, STATUS_NO_TOKEN, STATUS_INVALID_TOKEN } from "../constants";
import { Link, Navigate, useNavigate } from "react-router-dom";


function HomePage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [isSignupSuccess, setIsSignupSuccess] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const navigate = useNavigate()

    const closeDialog = () => setIsDialogOpen(false)

    useEffect(() => {
        // Update the document title using the browser API
        checkLoggedIn()
      });


    const setSuccessDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Success')
        setDialogMsg(msg)
    }

    const setErrorDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Error')
        setDialogMsg(msg)
    }

    const checkLoggedIn = async () => {
        console.log(localStorage.getItem("accessToken"))
        const res = await axios.post(URL_CHECK_TOKEN, {token: sessionStorage.getItem("accessToken")})
            .catch((err) => {
                navigate('/signup'); 
            })
    }

    return (
        <Box display={"flex"} flexDirection={"column"} width={"30%"}>
            <Typography variant={"h3"} marginBottom={"2rem"}> Welcome Home</Typography>
            <Button sx={{ m: 1 }} onClick={checkLoggedIn} variant={"outlined"}>Logout</Button>
        </Box>
    )
}

export default HomePage;

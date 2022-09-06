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


    const setConfirmDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Warning')
        setDialogMsg(msg)
    }

    const setErrorDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Error')
        setDialogMsg(msg)
    }

    const checkLoggedIn = async () => {
        const res = await axios.post(URL_CHECK_TOKEN, {token: sessionStorage.getItem("accessToken")})
            .catch((err) => {
                navigate('/signup'); 
            })
    }
    
    const confirmLogout = async () => {
        setConfirmDialog("You sure you want log out?")
    }

    const logoutUser = () => {
        sessionStorage.removeItem("accessToken")
        navigate('/signup')
    }

    return (
        <Box display={"flex"} flexDirection={"column"} width={"30%"}>
            <Typography variant={"h3"} marginBottom={"2rem"}> Welcome Home</Typography>
            <Button sx={{ m: 1 }} onClick={confirmLogout} variant={"outlined"}>Logout</Button>

            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={logoutUser}>Sure ahhh!</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default HomePage;

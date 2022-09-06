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
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED, STATUS_OK, STATUS_BAD_REQUEST, STATUS_INVALID_TOKEN } from "../constants";
import { Link, Navigate, useNavigate } from "react-router-dom";


function SignupPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [isSignupSuccess, setIsSignupSuccess] = useState(false)
    const [isLoginSuccess, setIsLoginSuccess] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        checkLoggedIn()
      });
    
      const checkLoggedIn = async () => {
        console.log(localStorage.getItem("accessToken"))
        const res = await axios.post(URL_CHECK_TOKEN, {token: sessionStorage.getItem("accessToken")})
            .catch((err) => {
                //navigate('/signup'); 
            })
        if (res.status === STATUS_OK) {
            navigate('/home')
        }
    }

    const handleSignup = async () => {
        setIsSignupSuccess(false)
        const res = await axios.post(URL_USER_SVC, { username, password })
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    setErrorDialog('This username already exists')
                } else {
                    setErrorDialog('Please try again later')
                }
            })
        if (res && res.status === STATUS_CODE_CREATED) {
            setSuccessDialog('Account successfully created')
            setIsSignupSuccess(true)
        }
    }

    const handleLogin = async () => {
        const res = await axios.post(URL_LOGIN_SVC, { username, password })
            .catch((err) => {
                setIsLoginSuccess(false)
                if (err.response.status === STATUS_BAD_REQUEST) {
                    setErrorDialog('Login failed')
                } else {
                    setErrorDialog('Something went wrong.. .Please try again later')
                }
            })

        if (res.status === STATUS_OK) {
            setIsLoginSuccess(true)
            const token = res.data.accessToken
            sessionStorage.setItem("accessToken", token)
            console.log("put in storage")
            navigate('/home');
        } 
    }

    const closeDialog = () => setIsDialogOpen(false)

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

    return (
        
        <Box display={"flex"} flexDirection={"column"} width={"30%"}>
            <Typography variant={"h3"} marginBottom={"2rem"}>Welcome</Typography>
            <TextField
                label="Username"
                variant="standard"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: "1rem" }}
                autoFocus
            />
            <TextField
                label="Password"
                variant="standard"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: "2rem" }}
            />
            <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} >
                <Button sx={{ m: 1 }} variant={"outlined"} onClick={handleLogin}>Login</Button>
                <Button sx={{ m: 1 }} variant={"outlined"} onClick={handleSignup}>Sign up</Button>
            </Box>

            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {isSignupSuccess
                        ? <Button component={Link} to="/home">Continue</Button>
                        : <Button onClick={closeDialog}>Close</Button>
                    }
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default SignupPage;

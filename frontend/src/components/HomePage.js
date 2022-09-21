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
    Typography,
    AppBar,
    Toolbar, 
    Link, 
    Container, 
    Grid, 
    tiers,
    Card,
    CardHeader, 
    StarIcon, 
    CardContent,
    CardActions,
    ButtonBase
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { URL_USER_SVC, URL_LOGIN_SVC, URL_CHECK_TOKEN, URL_CHANGE_PASSWORD } from "../configs";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED, STATUS_OK, STATUS_BAD_REQUEST, STATUS_NO_TOKEN, STATUS_INVALID_TOKEN } from "../constants";
import { Navigate, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";


function HomePage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")

    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isWrongPasswordDialogOpen, setWrongPasswordDialogOpen] = useState(false)
    const [isDeleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false)
    const [isChangePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)
    const [isChangeSuccessOpen, setChangeSuccessOpen] = useState(false)
    const socket = io("ws://localhost:8001", {transports: ['websocket']})
    const [isWaitingDialog, setWaitingDialog] = useState(false)
    const [isMatchedDialog, setMatchedDialog] = useState(false)
    const navigate = useNavigate()

    const closeDialog = () => setIsDialogOpen(false)
    const closeWaitingDialog = () => setWaitingDialog(false)
    const closeMatchDialog = () => setMatchedDialog(false)

    useEffect(() => {
        // Update the document title using the browser API
        checkLoggedIn()
      });


    const setConfirmDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Warning')
        setDialogMsg(msg)
    }

    const setMatchingDialog = (msg) => {
        setIsDialogOpen(true)

    }

    const setErrorDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Error')
        setDialogMsg(msg)
    }

    const checkLoggedIn = async () => {
        const res = await axios.post(URL_CHECK_TOKEN, {token: sessionStorage.getItem("accessToken")})
            .catch((err) => {
                navigate('/signin'); 
            })
    }
    
    const confirmLogout = async () => {
        setConfirmDialog("You sure you want log out?")
    }

    const logoutUser = () => {
        sessionStorage.removeItem("accessToken")
        sessionStorage.removeItem("username")
        navigate('/signin')
    }

    const handleDelete = async () => {
        const res = await axios.delete(URL_USER_SVC, {data: { username: sessionStorage.getItem("username"), password: password }})
            .catch((err) => {
                setDeleteDialogOpen(false)
                setWrongPasswordDialogOpen(true)
            })
        if (res && res.status === STATUS_OK) {
            setDeleteDialogOpen(false) 
            setDeleteSuccessDialogOpen(true)
        }
    }

    const handleChange = async () => {
        const res = await axios.post(URL_CHANGE_PASSWORD, { username: sessionStorage.getItem("username"), oldPassword: password, newPassword: newPassword })
            .catch((err) => {
                setChangePasswordDialogOpen(false)
                setWrongPasswordDialogOpen(true)
            })
        if (res && res.status === STATUS_OK) {
            setChangePasswordDialogOpen(false) 
            setChangeSuccessOpen(true)
        }
    }

    const startMatching = (selectedDifficulty) => {
        var userDetails = {
            "userOne": sessionStorage.getItem("username"),
            "difficulty": selectedDifficulty
        }
        socket.emit('match', userDetails); 
        setDialogTitle('Matching')
        setDialogMsg("waiting")
        setWaitingDialog(true) 
        socket.on('matchSuccess', (...args) => {
            setWaitingDialog(false)
            setMatchedDialog(true) 
            setDialogTitle('Matched')
            setDialogMsg("You have found a match!")
            

        })
    }

    return (
        <React.Fragment>
            <AppBar
            color="default"
            elevation={3}
            sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
            <Toolbar sx={{ flexWrap: 'wrap' }}>
                <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>Welcome Back, {sessionStorage.getItem("username")}</Typography>
                <nav>
                    <Link
                    variant="button"
                    color="text.primary"
                    href="#"
                    sx={{ my: 1, mx: 1.5 }}
                    onClick={() => setChangePasswordDialogOpen(true)}
                    >
                    Change Password
                    </Link>
                    <Link
                    variant="button"
                    color="text.primary"
                    href="#"
                    sx={{ my: 1, mx: 1.5 }}
                    onClick={() => setDeleteDialogOpen(true)}
                    >
                    Delete Account
                    </Link>
                    <Link
                    variant="button"
                    color="text.primary"
                    href="#"
                    sx={{ my: 1, mx: 1.5 }}
                    onClick={confirmLogout}
                    >
                    Logout
                    </Link>
                </nav>
            </Toolbar>
            </AppBar>

        <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Select Your Difficulty
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
            Match with someone online and get start coding! If there are no available opponents,
            we will let you know within 30 seconds.
        </Typography>
      </Container>
      <Container maxWidth="md" component="main">
        <Grid container spacing={5}>
            <Button onClick={() => startMatching("Easy")}> 
                Easy
            </Button>
            <Button onClick={() => startMatching("Medium")}> 
                Medium
            </Button>
            <Button onClick={() => startMatching("Difficult")}> 
                Difficult
            </Button>
        </Grid>
      </Container>
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

            <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogContent>
                    <Typography variant="body1">Please enter your password to confirm deleting account</Typography>
                    <TextField variant="standard" type="password" onChange={e => setPassword(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="warning" onClick={handleDelete}>Confirm</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isWrongPasswordDialogOpen} onClose={() => setWrongPasswordDialogOpen(false)}>
                <DialogTitle>Wrong Password</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setWrongPasswordDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isDeleteSuccessDialogOpen} onClose={() => setDeleteSuccessDialogOpen(false)}>
                <DialogActions>
                    <Typography variant="body1">{sessionStorage.getItem("username")} is succesfully deleted!</Typography>
                    <Button onClick={logoutUser}>Exit</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isChangePasswordDialogOpen} onClose={() => setChangePasswordDialogOpen(false)}>
                <DialogContent>
                    <Stack>
                        <TextField label="Old Password" variant="standard" type="password" onChange={e => setPassword(e.target.value)} />
                        <TextField label="New Password" variant="standard" type="password" onChange={e => setNewPassword(e.target.value)} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="warning" onClick={handleChange}>Confirm</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isChangeSuccessOpen} onClose={() => setChangeSuccessOpen(false)}>
                <DialogActions>
                    <Typography variant="body1">{sessionStorage.getItem("username")}'s password is succesfully changed!</Typography>
                    <Button onClick={() => setChangeSuccessOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>       
            <Dialog open={isWaitingDialog}
                onClose={() => setWaitingDialog(false)}>  
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setWaitingDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>     

            <Dialog open = {isMatchedDialog}
                onClose = {() => setMatchedDialog(false)}>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={()=> setMatchedDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog> 
        </React.Fragment>
        
    )
}

export default HomePage;

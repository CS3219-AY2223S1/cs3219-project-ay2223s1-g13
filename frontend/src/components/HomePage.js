import {
    AppBar,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    LinearProgress,
    Link,
    Slide,
    Stack,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

import { URL_USER_SVC, URL_CHECK_TOKEN, URL_CHANGE_PASSWORD } from "../configs";
import { STATUS_OK, difficulties } from "../constants";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


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
    const socket = io("ws://localhost:8001", { transports: ['websocket'] })
    const [isWaitingDialog, setWaitingDialog] = useState(false)
    const [isMatchedDialog, setMatchedDialog] = useState(false)
    const [isNoMatchDialog, setNoMatchDialog] = useState(false)
    const [selectedDifficulty, setSelectedDifficulty] = useState("")
    const navigate = useNavigate()

    const [timeLeft, setTimeLeft] = useState(10)
    var timer
    const startTimer = () => {
        setTimeLeft(30)
        timer = setInterval(() => {
            setTimeLeft((remaining) => {
                if (remaining > 0) {
                    return remaining - 1
                } else {
                    endMatching()
                    return 0
                }
            });
        }, 1000);
    }

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

    const checkLoggedIn = async () => {
        await axios.post(URL_CHECK_TOKEN, { token: sessionStorage.getItem("accessToken") })
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
        const res = await axios.delete(URL_USER_SVC, { data: { username: sessionStorage.getItem("username"), password: password } })
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

    const startMatching = () => {
        var userDetails = {
            "userOne": sessionStorage.getItem("username"),
            "difficulty": selectedDifficulty
        }
        socket.emit('match', userDetails);
        setWaitingDialog(true)
        startTimer()
        socket.on('matchSuccess', (...args) => {
            setWaitingDialog(false)
            setMatchedDialog(true)
            setDialogTitle('Matched')
            setDialogMsg("You have found a match!")
            sessionStorage.setItem("roomId", args[0].roomId)
            sessionStorage.setItem("difficulty", selectedDifficulty)
        })
    }

    const endMatching = () => {
        setWaitingDialog(false)
        setNoMatchDialog(true)
        clearInterval(timer)
        removeOverdueMatch();
    }

    const removeOverdueMatch = () => {
        socket.emit('cancelmatch', { user: sessionStorage.getItem("username") })
    }

    const handleStart = () => {
        socket.emit('start', { roomId: sessionStorage.getItem("roomId") });
        navigate('/room');
    };

    socket.on("partner start", () => {
        navigate('/room');
    });

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
                <Grid container justifyContent="center" spacing={1}>
                    {difficulties.map((difficulty) => {
                        return <Button onClick={() => { setSelectedDifficulty(difficulty); startMatching(difficulty) }} size="large" key={difficulty}>
                            {difficulty}
                        </Button>
                    })}
                </Grid>
            </Container>
            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
                TransitionComponent={Transition}
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={logoutUser}>Sure ahhh!</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} TransitionComponent={Transition}>
                <DialogContent>
                    <Typography variant="body1">Please enter your password to confirm deleting account</Typography>
                    <TextField variant="standard" type="password" onChange={e => setPassword(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="warning" onClick={handleDelete}>Confirm</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isWrongPasswordDialogOpen} onClose={() => setWrongPasswordDialogOpen(false)} TransitionComponent={Transition}>
                <DialogTitle>Wrong Password</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setWrongPasswordDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isDeleteSuccessDialogOpen} onClose={() => setDeleteSuccessDialogOpen(false)} TransitionComponent={Transition}>
                <DialogActions>
                    <Typography variant="body1">{sessionStorage.getItem("username")} is succesfully deleted!</Typography>
                    <Button onClick={logoutUser}>Exit</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isChangePasswordDialogOpen} onClose={() => setChangePasswordDialogOpen(false)} TransitionComponent={Transition}>
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

            <Dialog open={isChangeSuccessOpen} onClose={() => setChangeSuccessOpen(false)} TransitionComponent={Transition}>
                <DialogActions>
                    <Typography variant="body1">{sessionStorage.getItem("username")}'s password is succesfully changed!</Typography>
                    <Button onClick={() => setChangeSuccessOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isWaitingDialog} onClose={(e, r) => { if (r !== "backdropClick") { setWaitingDialog(false) } }} TransitionComponent={Transition}>
                <DialogContent>
                    <Stack spacing={2} p={1}>
                        <Stack spacing={1}>
                            <Typography variant="h4">Finding a Match...</Typography>
                            <Typography variant="h6">Selected Difficulty: {selectedDifficulty}</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={(30 - timeLeft) / 30 * 100} />
                        <Typography variant="h6">{timeLeft} seconds left</Typography>
                        <Button onClick={() => { setTimeLeft(0); endMatching() }}>Stop</Button>
                    </Stack>
                </DialogContent>
            </Dialog>

            <Dialog open={isNoMatchDialog} onClose={(e, r) => { if (r !== "backdropClick") { setNoMatchDialog(false) } }} TransitionComponent={Transition}>
                <DialogContent>
                    <Stack spacing={1} p={1} alignItems="center" justifyContent="center">
                        <Typography variant="h5">No Match Found</Typography>
                        <Typography variant="h6">Select another difficulty or try again later!</Typography>
                        <Button onClick={() => { setNoMatchDialog(false); removeOverdueMatch(); }}>Close</Button>
                    </Stack>
                </DialogContent>
            </Dialog>

            <Dialog open={isMatchedDialog} onClose={(e, r) => { if (r !== "backdropClick") { navigate('/room') } }} TransitionComponent={Transition}>
                <DialogTitle>Yay🎉</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleStart}>Start</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>

    )
}

export default HomePage;

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
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

import { URL_USER_SVC, URL_CHECK_TOKEN, URL_CHANGE_PASSWORD, URL_HISTORY_SVC } from "../configs";
import { STATUS_OK, difficulties } from "../constants";

import "./HomePage.css"
import Section from "./common/Section/Section";
import { fetchQuestion } from "./Question/api";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const socket = io("wss://matching-service-au7tawfmmq-uc.a.run.app", { transports: ['websocket'] })

function HomePage() {
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isWrongPasswordDialogOpen, setWrongPasswordDialogOpen] = useState(false)
    const [isDeleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false)
    const [isChangePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
    const [isChangeSuccessOpen, setChangeSuccessOpen] = useState(false)
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isWaitingDialog, setWaitingDialog] = useState(false)
    const [isMatchedDialog, setMatchedDialog] = useState(false)
    const [isNoMatchDialog, setNoMatchDialog] = useState(false)
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [waitingDifficulty, setWaitingDifficulty] = useState("");
    const [selectedDifficultyAvail, setSelectedDifficultyAvail] = useState(false);
    const [questionsSolved, setQuestionsSolved] = useState({easy: 0, medium: 0, hard: 0})
    const [histories, setHistories] = useState([])
    const [matched, setMatched] = useState(0);

    const navigate = useNavigate()

    const [timeLeft, setTimeLeft] = useState(10)
    const timer = useRef(null)

    useEffect(() => {
        // Update the document title using the browser API
        const checkLoggedIn = async () => {
            await axios.post(URL_CHECK_TOKEN, { token: sessionStorage.getItem("accessToken") })
                .catch((err) => {
                    navigate('/signin');
                })
        }
        checkLoggedIn()
        setSelectedDifficultyAvail(false)
    });

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        fetchQuestionsSolved();

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    });

    const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
    }

    const fetchQuestionsSolved = async () => {
        const res = await axios.get(URL_HISTORY_SVC, {
            params: { 
                username: sessionStorage.getItem("username") 
            }
        })
        const histories = res.data.history.reverse()
        setHistories(histories);
        const easySolved = (histories.filter(history => history.difficulty==="Easy").map((history) => history.question).filter(onlyUnique)).length;
        const mediumSolved = (histories.filter(history => history.difficulty ==="Medium").map((history) => history.question).filter(onlyUnique)).length;
        const hardSolved = (histories.filter(history => history.difficulty ==="Hard").map((history) => history.question).filter(onlyUnique)).length;
        setQuestionsSolved({easy: easySolved, medium: mediumSolved, hard: hardSolved})
    }

    useEffect(() => {
        const startMatching = () => {
            let userDetails = {
                "userOne": sessionStorage.getItem("username"),
                "difficulty": selectedDifficulty
            }
            socket.emit('match', userDetails);
            setWaitingDifficulty(selectedDifficulty)
            setWaitingDialog(true)
            startTimer()
            socket.on('matchSuccess', async (...args) => {
                setWaitingDialog(false)
                setMatchedDialog(true)
                clearInterval(timer.current)
                sessionStorage.setItem("roomId", args[0].roomId)
                sessionStorage.setItem("questionIds", args[0].questionIds)
                sessionStorage.setItem("difficulty", selectedDifficulty)
                const ids = args[0].questionIds;
                const questions = await getQuestions(ids);
                if(matched==0){
                    questions.forEach((question) => {
                        updateHistory(question);
                    })
                    setMatched(matched => matched + 1);
                }
            })
        }

        const startTimer = () => {
            setTimeLeft(30)
            timer.current = setInterval(() => {
                setTimeLeft((remaining) => {
                    if (remaining > 0) {
                        return remaining - 1
                    } else {
                        setWaitingDialog(false)
                        setNoMatchDialog(true)
                        clearInterval(timer.current)
                        socket.emit('removematch', { user: sessionStorage.getItem("username") });
                        return 0
                    }
                });
            }, 1000);
        }

        if (selectedDifficultyAvail) {
            startMatching();
            setSelectedDifficulty(false);
        }
    }, [selectedDifficultyAvail, selectedDifficulty]);

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

            // delete history for the user
            const username = sessionStorage.getItem("username");
            await axios.delete(`${URL_HISTORY_SVC}/?username=${username}`)
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

    const getQuestions = async (ids) => {
        const firstQuestion = await fetchQuestion(ids[0]);
        const secondQuestion = await fetchQuestion(ids[1]);
        return [firstQuestion,secondQuestion]
    }

    const updateHistory = async (question) => {
        const room_id = sessionStorage.getItem("roomId");
        const cur_username = sessionStorage.getItem("username");
        const usernames = room_id.split("_");
        const difficulty = sessionStorage.getItem("difficulty");
        const questionName = question.title;
        const questionId = question.id;
        await axios.post(URL_HISTORY_SVC, {
            username: cur_username === usernames[0] ? usernames[0] : usernames[1], 
            matchedUsername: cur_username === usernames[0] ? usernames[1] : usernames[0],
            difficulty,
            question: questionName,
            questionId
        })
    }
    
    const endMatching = () => {
        setWaitingDialog(false)
        setNoMatchDialog(true)
        clearInterval(timer.current)
        removeOverdueMatch();
    }

    const removeOverdueMatch = () => {
        socket.emit('removematch', { user: sessionStorage.getItem("username") });
    }

    const handleStart = async () => {
        socket.emit('start', { roomId: sessionStorage.getItem("roomId") });
        navigate('/room');
    };

    socket.on("partner start", () => {
        navigate('/room');
    });

    const displayQuestionsSolved = () => {
        return (
            <div style={{display: "flex"}}>
                <div style={{paddingRight: "0.5vw"}}>
                    <div>Solved: </div>
                </div>
                <div style={{display: "flex", alignItems: "center", paddingRight: "0.75vw"}}>
                    <div style={{width: "0.75vw", height: "0.75vw", background: "var(--green)", borderRadius: "99%"}}>
                    </div>
                    <div style={{paddingLeft: "0.25vw"}}>
                        {questionsSolved.easy}
                    </div>
                </div>  
                <div style={{display: "flex", alignItems: "center", paddingRight: "0.75vw"}}>
                    <div style={{width: "0.75vw", height: "0.75vw",  background: "var(--yellow)",  borderRadius: "99%"}}>
                    </div>
                    <div style={{paddingLeft: "0.25vw"}}>
                        {questionsSolved.medium}
                    </div>
                </div>  
                <div style={{display: "flex", alignItems: "center"}}>
                    <div style={{width: "0.75vw", height: "0.75vw",  background: "red",  borderRadius: "99%"}}>
                    </div>
                    <div style={{paddingLeft: "0.25vw"}}>
                        {questionsSolved.hard}
                    </div>
                </div>  
            </div>
        )
    }

    const displayHistory = (history) => {
        const {matchedUsername, difficulty, question} = history;
        const borderColor = difficulty === "Easy" ? ("var(--green)") : (difficulty === "Medium" ? "var(--yellow)": "red")
        return (
            <div className="history_row" style={{border: `0.25rem solid ${borderColor}`}}>
                <div className="history_section">
                    <div className="history_label">With:</div>
                    <div className="history_value">{matchedUsername}</div>
                </div>
                <div className="history_section">
                    <div className="history_label">Level:</div>
                    <div className="history_value">{difficulty}</div>
                </div>
                <div className="history_section">
                    <div className="history_label">Question:</div>
                    <div className="history_value">{question}</div>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
            <AppBar
                color="default"
                elevation={3}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Toolbar sx={{ flexWrap: 'wrap' }}>
                    <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>Welcome Back, {sessionStorage.getItem("username")}</Typography>
                    {displayQuestionsSolved()}
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
                            onClick={() => setIsLogoutDialogOpen(true)}
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
                        return <div className={`difficulty_button difficulty_button_${difficulty}`} 
                                    onClick={() => { setSelectedDifficultyAvail(true); setSelectedDifficulty(difficulty); }} 
                                    size="large" 
                                    key={difficulty}
                                >
                            {difficulty}
                        </div>
                    })}
                </Grid>
            </Container>
            <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 6 }}>
                <Section title={"Previous Attempts"} width={"100%"}>
                    <div>
                        {histories.map((history) => {
                            return displayHistory(history);
                        })}
                    </div>
                </Section>
            </Container>

            <Dialog open={isLogoutDialogOpen} onClose={() => setIsLogoutDialogOpen(false)} TransitionComponent={Transition}>
                <DialogContent>
                    <Stack spacing={1}>
                        <Typography variant="h6">Confirm to log out?</Typography>
                        <Button color="error" onClick={logoutUser}>Log Out</Button>
                    </Stack>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} TransitionComponent={Transition}>
                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="body1">Please enter your password to confirm deleting account</Typography>
                        <TextField variant="standard" type="password" onChange={e => setPassword(e.target.value)} />
                        <Button variant="contained" color="error" onClick={handleDelete}>Confirm</Button>
                    </Stack>                        
                </DialogContent>
            </Dialog>

            <Dialog open={isWrongPasswordDialogOpen} onClose={() => setWrongPasswordDialogOpen(false)} TransitionComponent={Transition}>
                <DialogActions>
                    <Stack spacing={1} p={1}>
                        <Typography variant="h6">Wrong Password</Typography>
                        <Button color="error" onClick={() => setWrongPasswordDialogOpen(false)}>Close</Button>
                    </Stack>
                </DialogActions>
            </Dialog>

            <Dialog open={isDeleteSuccessDialogOpen} onClose={() => setDeleteSuccessDialogOpen(false)} TransitionComponent={Transition}>
                <DialogActions>
                    <Stack spacing={1} p={1}>
                        <Typography variant="h6">Succesfully deleted {sessionStorage.getItem("username")}</Typography>
                        <Button color="error" onClick={logoutUser}>Close</Button>
                    </Stack>
                </DialogActions>
            </Dialog>

            <Dialog open={isChangePasswordDialogOpen} onClose={() => setChangePasswordDialogOpen(false)} TransitionComponent={Transition}>
                <DialogContent>
                    <Stack spacing={1} p={1} alignItems="center" justifyContent="center">
                        <Typography variant="h5">Change Password</Typography>
                        <TextField label="Old Password" variant="standard" type="password" onChange={e => setPassword(e.target.value)} />
                        <TextField label="New Password" variant="standard" type="password" onChange={e => setNewPassword(e.target.value)} />
                        <Button sx={{width: '50%'}} variant="contained" color="error" onClick={handleChange}>Confirm</Button>
                    </Stack>
                </DialogContent>
            </Dialog>

            <Dialog open={isChangeSuccessOpen} onClose={() => setChangeSuccessOpen(false)} TransitionComponent={Transition}>
                <DialogActions>
                    <Stack spacing={2} p={1} alignItems="center" justifyContent="center">
                        <Typography variant="h6">Password is successfully changed!</Typography>
                        <Button sx={{width: '40%'}} color="error" onClick={() => setChangeSuccessOpen(false)}>Close</Button>
                    </Stack>
                </DialogActions>
            </Dialog>

            <Dialog open={isWaitingDialog} onClose={(e, r) => { if (r !== "backdropClick") { setWaitingDialog(false) } }} TransitionComponent={Transition}>
                <DialogContent>
                    <Stack spacing={2} p={1}>
                        <Stack spacing={1}>
                            <Typography variant="h4">Finding a Match...</Typography>
                            <Typography variant="h6">Selected Difficulty: {waitingDifficulty}</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={(30 - timeLeft) / 30 * 100} color="error"/>
                        <Typography variant="h6">{timeLeft} seconds left</Typography>
                        <Button color="error" onClick={() => { setTimeLeft(0); endMatching() }}>Stop</Button>
                    </Stack>
                </DialogContent>
            </Dialog>

            <Dialog open={isNoMatchDialog} onClose={(e, r) => { if (r !== "backdropClick") { setNoMatchDialog(false) } }} TransitionComponent={Transition}>
                <DialogContent>
                    <Stack spacing={1} p={1} alignItems="center" justifyContent="center">
                        <Typography variant="h5">No Match Found</Typography>
                        <Typography variant="h6">Select another difficulty or try again later!</Typography>
                        <Button onClick={() => { setNoMatchDialog(false); removeOverdueMatch(); }} color="error">Close</Button>
                    </Stack>
                </DialogContent>
            </Dialog>

            <Dialog open={isMatchedDialog} onClose={(e, r) => { if (r !== "backdropClick") { navigate('/room') } }} TransitionComponent={Transition}>
                <DialogTitle>Yay🎉</DialogTitle>
                <DialogContent>
                    <DialogContentText>You got a match!</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleStart}>Start</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>

    )
}

export default HomePage;

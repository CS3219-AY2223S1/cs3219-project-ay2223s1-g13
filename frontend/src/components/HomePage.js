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
import { useState, useEffect } from "react";
import axios from "axios";
import { URL_USER_SVC, URL_LOGIN_SVC, URL_CHECK_TOKEN, URL_CHANGE_PASSWORD } from "../configs";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED, STATUS_OK, STATUS_BAD_REQUEST, STATUS_NO_TOKEN, STATUS_INVALID_TOKEN } from "../constants";
import { Link, Navigate, useNavigate } from "react-router-dom";


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
        sessionStorage.removeItem("username")
        navigate('/signup')
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

    return (
        <Box display={"flex"} flexDirection={"column"} width={"30%"}>
            <Typography variant={"h3"} marginBottom={"2rem"}> Welcome, {sessionStorage.getItem("username")}</Typography>
            <Button sx={{ m: 1 }} variant={"outlined"} onClick={() => setChangePasswordDialogOpen(true)}>Change Password</Button>
            <Button sx={{ m: 1 }} variant={"outlined"} onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
            <Button sx={{ m: 1 }} variant={"outlined"} onClick={confirmLogout}>Logout</Button>

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
        </Box>
    )
}

export default HomePage;

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
import { useState } from "react";
import axios from "axios";
import { URL_USER_SVC, URL_LOGIN_SVC } from "../configs";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED, STATUS_OK, STATUS_BAD_REQUEST, STATUS_CODE_NOT_ACCEPTABLE } from "../constants";
import { Link } from "react-router-dom";

function SignupPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [isSignupSuccess, setIsSignupSuccess] = useState(false)

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
                if (err.response.status === STATUS_BAD_REQUEST) {
                    setErrorDialog('Login failed')
                } else {
                    setErrorDialog('Something went wrong.. .Please try again later')
                }
            })
        if (res && res.status === STATUS_OK) {
            setSuccessDialog('User credentials are correct -- log in to be implemented')
        }
    }

    const handleDelete = async () => {
      const res = await axios.delete(URL_USER_SVC, {data: { username, password }})
          .catch((err) => {
              if (err.response.status === STATUS_CODE_CONFLICT) {
                  setErrorDialog('Incorrect password!')
              } else if (err.response.status === STATUS_CODE_NOT_ACCEPTABLE) {
                setErrorDialog('Username not found!')
              } else {
                  setErrorDialog('Something went wrong')
              }
          })
      if (res && res.status === STATUS_OK) {
          setSuccessDialog(`User ${username} deleted successfully!`)
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
                <Button sx={{ m: 1 }} variant={"outlined"} onClick={handleDelete}>Delete</Button>
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
                        ? <Button component={Link} to="/login">Log in</Button>
                        : <Button onClick={closeDialog}>Done</Button>
                    }
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default SignupPage;

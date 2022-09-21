import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography, 
    FormControlLabel,
    Checkbox,
    Container,
    Grid,
    CssBaseline,
    Avatar,
    Icon, 
    PageviewIcon
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

import { URL_USER_SVC, URL_LOGIN_SVC, URL_CHECK_TOKEN } from "../configs";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED, STATUS_OK, STATUS_BAD_REQUEST, STATUS_CODE_NOT_ACCEPTABLE, STATUS_INVALID_TOKEN } from "../constants";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from '../resources/background.jpeg';

function SignUpPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isDifferentPassword, setDifferentPassword] = useState(false) 
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [signUpSuccess, setIsSignupSuccess] = useState("")
    const theme = createTheme();

    const closeDifferentPassword = () => setDifferentPassword(false) 


    const openDifferentPasswordDialog = () => { 
        setDifferentPassword(true)
        setDialogTitle('Error')
        setDialogMsg('Passwords do not match')
    }

    const setErrorDialog = (msg) => { 
        setDifferentPassword(true)
        setDialogTitle('Error')
        setDialogMsg(msg)
    }

    const openSignUpSuccessDialog = (msg) => {
        setIsSignupSuccess(true) 
        setDialogTitle('Success')
        setDialogMsg(msg)
    }

    const closeSignUpSuccessDialog = () => setIsSignupSuccess(false)

    const handleSignUp = async () => {
        if (password != confirmPassword) {
            openDifferentPasswordDialog()
        } else { 

            const res = await axios.post(URL_USER_SVC, { username, password })
                .catch((err) => {
                    if (err.response.status === STATUS_CODE_CONFLICT) {
                        setErrorDialog('This username already exists')
                    } else {
                        setErrorDialog('Please try again later')
                    }
                })
            if (res && res.status === STATUS_CODE_CREATED) {
                openSignUpSuccessDialog('Account successfully created')
                setIsSignupSuccess(true)
            }
        }
    }


    return (
        <ThemeProvider theme={theme}> 
        <Container component="main" maxWidth="xs" display='flex' justifyContent='center' > 
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >              
            <Typography component="h1" variant="h5">
              Create New Account
            </Typography>
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm your password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }} onClick={handleSignUp}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item xs>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Dialog
                open={isDifferentPassword}
                onClose={closeDifferentPassword}
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDifferentPassword}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={signUpSuccess}
                onClose={closeSignUpSuccessDialog}
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button component={Link} to="/signin">Continue</Button>
                </DialogActions>
            </Dialog>
        </Container>
      </ThemeProvider>
    )
}


export default SignUpPage;
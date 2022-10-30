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
  Container,
  Grid,
  Link,
  CssBaseline,
} from "@mui/material";

import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from "react";
import axios from "axios";

import { URL_LOGIN_SVC, URL_CHECK_TOKEN } from "../configs";
import { STATUS_OK, STATUS_BAD_REQUEST } from "../constants";
import { useNavigate } from "react-router-dom";

function SignInPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogMsg, setDialogMsg] = useState("")
  const navigate = useNavigate()
  const theme = createTheme();

  useEffect(() => {
    checkLoggedIn()
  });

  const checkLoggedIn = async () => {
    if (sessionStorage.getItem("accessToken")) {
        const res = await axios.post(URL_CHECK_TOKEN, { token: sessionStorage.getItem("accessToken") })
            .catch(error => console.log("User not logged in"));
        
        if (res.status === STATUS_OK) {
        navigate('/home')
        }
    }
  }

  const handleLogin = async () => {
    if (username === "" || password === "") {
        setIsDialogOpen(true)
        setDialogTitle("")
        setDialogMsg("Please enter both username and password!")
        return;
    }

    const res = await axios.post(URL_LOGIN_SVC, { username, password })
      .catch((err) => {
        if (err.response.status === STATUS_BAD_REQUEST) {
          setErrorDialog('Incorrect username/password!')
        } else {
          setErrorDialog('Something went wrong... Please try again later')
        }
      })

    if (res.status === STATUS_OK) {
      const token = res.data.accessToken
      sessionStorage.setItem("accessToken", token)
      sessionStorage.setItem("username", username.toLowerCase())
      navigate('/home');
    }
  }

  const closeDialog = () => setIsDialogOpen(false)

  const setErrorDialog = (msg) => {
    setIsDialogOpen(true)
    setDialogTitle('Error')
    setDialogMsg(msg)
  }

  const handleKey = (key) => {
    if (key.keyCode === 13) {
      handleLogin()
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" display='flex' justifyContent='center'>
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
            Sign In
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
              onKeyDown={handleKey}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }} onClick={handleLogin}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Dialog open={isDialogOpen} onClose={closeDialog}>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogMsg}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  )
}

export default SignInPage;

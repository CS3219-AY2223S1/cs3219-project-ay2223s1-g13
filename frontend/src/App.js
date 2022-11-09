import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import LandingPage from "./components/LandingPage";
import HomePage from './components/HomePage';
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import RoomPage from "./components/RoomPage";

function App() {
    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<LandingPage/>}></Route>
                        <Route path="/signin" element={<SignInPage/>}/>
                        <Route path="/signup" element={<SignUpPage/>}/>
                        <Route path="/home" element={<HomePage/>}/> 
                        <Route path="/room" element={<RoomPage/>}/>
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;

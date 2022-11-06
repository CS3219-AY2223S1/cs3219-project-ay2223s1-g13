import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import LandingPage from "./components/LandingPage";
import HomePage from './components/HomePage';
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import RoomPage from "./components/RoomPage";
import CodeEditor from "./components/CodeEditor";

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
                        <Route path="/test" element={<CodeEditor room_id="test"/>}/>
                        <Route path="/test2" element={<CodeEditor room_id="test2"/>}/>
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;

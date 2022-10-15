import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import HomePage from './components/HomePage';
import {Box} from "@mui/material";
import DifficultySelector from "./components/Matching/DifficultySelector/DifficultySelector";
import RoomPage from "./components/RoomPage";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import LandingPage from "./components/LandingPage"


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
                        <Route path="/difficulty_test" element={<DifficultySelector/>}/>
                        <Route path="/room" element={<RoomPage/>}/>

                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;

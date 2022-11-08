import React, { useEffect } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./LandingPage.css";
import NavBar from "./common/Navbar/Navbar";
import axios from "axios";
import { STATUS_OK } from "../constants";
import { URL_CHECK_TOKEN } from "../configs";
import TypyingAnimation from "./common/TypingAnimated/TypingAnimation";

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        checkLoggedIn()
      });
    
      const checkLoggedIn = async () => {
        if (sessionStorage.getItem("accessToken")) {
            const res = await axios.post(URL_CHECK_TOKEN, { token: sessionStorage.getItem("accessToken") });

            if (res.status === STATUS_OK) {
            navigate('/home')
            }
        }
      }

    return (
        <>
            <NavBar />
            <div>
                <div
                    style={{
                        display: "flex",
                        paddingBottom: "5%",
                        justifyContent: "space-between",
                        backgroundColor: "white",
                    }}
                    className="Top_Area_Responsive"
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                        className="Top_Area_Text_Left_Responsive"
                    >
                        <div
                            style={{
                                marginTop: "10vh",
                                fontSize: "3.5rem",
                                width: "45vw",
                                cursor: "pointer",
                            }}
                        >
                            <span
                                className="underLine"
                                style={{
                                    fontFamily: " 'Ubuntu', sans-serif",
                                    fontWeight: "bolder",
                                }}
                            >
                                CodeUs
                            </span>{" "}
                            <br />{" "}
                            <span
                                className="underLine1 Responsive_Head"
                                style={{
                                    fontFamily: "'Roboto Mono', monospace",
                                    fontWeight: "100",
                                }}
                            >
                                <TypyingAnimation strings={["Code with peers", "Learn from them", "Repeat"]}/>
                            </span>
                            <div style={{}}>
                                <Typography
                                    style={{
                                        width: "45vw",
                                        fontSize: "2rem",
                                        margin: "auto",
                                        fontWeight: "lighter",
                                    }}
                                    variant="subtitle1"
                                    color="initial"
                                >
                                    Our aim is to provide a platform for
                                    practicing live coding with a fellow peer
                                    and getting the hang of a tech interview
                                    <br />
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => navigate("/signup")}
                                    >
                                        Sign Up
                                    </Button>
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="Top_Area_Text_Right_Responsive">
                        <img
                            style={{ width: "40vw", objectFit: "contain" }}
                            src="/landing_page.jpg"
                            alt="code"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;

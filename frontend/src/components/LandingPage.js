import React, { useEffect } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./LandingPage.css";
import NavBar from "./common/Navbar/Navbar";
import axios from "axios";
import { STATUS_OK } from "../constants";
import { URL_CHECK_TOKEN } from "../configs";

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        checkLoggedIn()
      });
    
      const checkLoggedIn = async () => {
        const res = await axios.post(URL_CHECK_TOKEN, { token: sessionStorage.getItem("accessToken") })

        if (res.status === STATUS_OK) {
          navigate('/home')
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
                        justifyContent: "space-around",
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
                                marginTop: "5vh",
                                fontSize: "50px",
                                width: "35vw",
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
                                Practice Live Coding
                            </span>
                            <div style={{}}>
                                <Typography
                                    style={{
                                        width: "45vw",
                                        fontSize: "30px",
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

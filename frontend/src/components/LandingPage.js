import React from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <>
            <div>
                <div
                    style={{
                        display: "flex",
                        paddingBottom: "5%",
                        justifyContent: "space-around",
                        backgroundColor: "white",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                        }}
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
                                style={{
                                    fontFamily: " 'Ubuntu', sans-serif",
                                    fontWeight: "bolder",
                                }}
                            >
                                CodeUs
                            </span>{" "}
                            <br />{" "}
                            <span
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
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => navigate("/signup")}
                                    >
                                        Sign Up
                                    </Button>
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img
                            style={{ width: "40vw", objectFit: "contain" }}
                            src="/landing_page.jpg"
                            alt="helping image"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;

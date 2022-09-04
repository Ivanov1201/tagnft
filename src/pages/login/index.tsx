import React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useMetaMask } from "metamask-react";
import { useNavigate } from 'react-router-dom';

const ContainerBox = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export function Login() {
  const { status, connect, account, chainId, switchChain } = useMetaMask();
  const navigate  = useNavigate();

  const login = async () => {
    if (status === "unavailable") {
      alert("Please install metamask!");
      return;
    }
    await connect().then(async () => {
      if (chainId !== "0x89") await switchChain("0x89");
    });
  };

  useEffect(() => {
    if (status === "connected"){
      navigate('/');
    }
  }, [status]);

  return (
    <>
      <Container maxWidth="sm">
        <Box
          sx={{ bgcolor: "#cfe8fc", height: "80vh", mt: "10vh" }}
          style={ContainerBox}
        >
          {status === "connected" ? (
            <>
              You are logged in as <br />
              {account}
            </>
          ) : (
            <Button variant="contained" sx={{ minWidth: 200 }} onClick={login}>
              Login
            </Button>
          )}         
        </Box>
      </Container>
    </>
  );
}

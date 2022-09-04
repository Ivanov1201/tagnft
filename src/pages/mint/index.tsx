import React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useMetaMask } from "metamask-react";
import { useNavigate } from "react-router-dom";

import { mintTagNft } from "src/utils/web3";

const ContainerBox = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#999999",
};

const WrapBoxStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
};

const ModalButtonBoxStyle = {
  display: "flex",
  justifyContent: "space-around",
  width: "100%",
};

const ModalButtonStyle = {
  fontSize: "20px",
  minWidth: "100px",
};

const MAX_MINT_COUNT = 10;

export function Mint() {
  const { status } = useMetaMask();
  const navigate = useNavigate();

  const [ownedCount, setOwnedCount] = useState(10);
  const [mintCount, setMintCount] = useState(0);

  const handleMintCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]+$/;
    const _val = event.target.value;
    if (re.test(_val)) {
      setMintCount(Math.min(parseInt(_val), MAX_MINT_COUNT));
    }
  };

  const increaseMintCount = () => {
    setMintCount(Math.min(mintCount + 1, MAX_MINT_COUNT));
  };

  const decreaseMintCount = () => {
    setMintCount(Math.max(mintCount - 1, 0));
  };

  const onMint = () => {
    mintTagNft(mintCount);
  };

  useEffect(() => {
    console.log(status);
    if (status !== "initializing" && status !== "connected") {
      navigate("/login");
    }
  }, [status]);


  return (
    <>
      <Box
        sx={{ height: "100vh", backgroundColor: 'grey' }}
        style={ContainerBox}
      >
        <Box sx={{ width: 300, height: 400, bgcolor: "white"}} style={WrapBoxStyle as React.CSSProperties}>
          <Typography variant="h5" sx ={{pt:5, pb:5}}> {"Mint"} </Typography>
          <Typography> {`You have ${ownedCount} tags.`} </Typography>
          <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
            {"How many Tags would you"} <br />
            {"like to mint?"}
          </Typography>
          <Box>
            <Button variant="contained" onClick={decreaseMintCount}>
              <RemoveIcon />
            </Button>
            <TextField
              inputProps={{ sx: { textAlign: "center", padding: 1 } }}
              sx={{ width: 80 }}
              value={mintCount}
              onChange={handleMintCountChange}
            />
            <Button variant="contained" onClick={increaseMintCount}>
              <AddIcon />
            </Button>
          </Box>
          <Box style={ModalButtonBoxStyle}>
            <Button
              variant="contained"
              style={ModalButtonStyle}
              onClick={onMint}
              color="success"
            >
              Mint
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

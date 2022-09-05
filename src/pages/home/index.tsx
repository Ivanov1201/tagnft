import React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { useMetaMask } from "metamask-react";
import { useNavigate } from "react-router-dom";
import {
  calc_sell_weth_from_count,
  calc_buy_weth_from_count,
} from "src/utils/arithmetic";
import { initConnection, getTagCount, sellTagNft, buyTagNft } from "src/utils/web3";

const TabTitleStyle = {
  flex: 1,
  fontWeight: "bold",
};

const TabPanelStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
};

const ContainerBox_sell = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#cfe2f3",
};

const ContainerBox_buy = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f9cb9c",
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const MAX_BUY_COUNT = 10;

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }} style={TabPanelStyle as React.CSSProperties}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function Home() {
  const { status } = useMetaMask();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState(0);
  const [ownedCount, setOwnedCount] = useState(0);
  const [sellCount, setSellCount] = useState(0);
  const [buyCount, setBuyCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  /// Sell Tab ///
  const handleSellCountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const re = /^[0-9\b]+$/;
    const _val = event.target.value;
    if (re.test(_val)) {
      setSellCount(Math.min(parseInt(_val), ownedCount));
    }
  };

  const increaseSellCount = () => {
    setSellCount(Math.min(sellCount + 1, ownedCount));
  };

  const decreaseSellCount = () => {
    setSellCount(Math.max(sellCount - 1, 0));
  };

  const onSell = () => {
    if (!sellCount) alert("Please select how many tags you would like to sell");
    sellTagNft(sellCount);
  };

  const onAll = () => {
    setSellCount(ownedCount);
  };
  ////

  //// Buy Tab ////

  const handleBuyCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]+$/;
    const _val = event.target.value;
    if (re.test(_val)) {
      setBuyCount(Math.min(parseInt(_val), MAX_BUY_COUNT));
    }
  };

  const increaseBuyCount = () => {
    setBuyCount(Math.min(buyCount + 1, MAX_BUY_COUNT));
  };

  const decreaseBuyCount = () => {
    setBuyCount(Math.max(buyCount - 1, 0));
  };

  const onBuy = () => {
    if (!buyCount) alert("Please select how many tags you would like to buy");
    buyTagNft(buyCount);
  };
  ////

  useEffect(() => {
    if (status !== "initializing" && status !== "connected") {
      navigate("/login");
    }
    if (status === "connected") fetchData();
  }, [status]);

  const fetchData = async () => {
    setLoading(true);
    await initConnection();
    await getTagCount().then((rlt) => {
      setOwnedCount(rlt);
    });
    setLoading(false);
  };

  // useEffect(() => {
  //   fetchData().catch(console.error);
  // }, []);

  return (
    <>
      <Box
        sx={{ height: "100vh" }}
        style={selectedTab ? ContainerBox_buy : ContainerBox_sell}
      >
        <Box sx={{ width: 300, height: 400, bgcolor: "white" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={selectedTab}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Sell" {...a11yProps(0)} style={TabTitleStyle} />
              <Tab label="Buy" {...a11yProps(1)} style={TabTitleStyle} />
            </Tabs>
          </Box>
          <TabPanel value={selectedTab} index={0}>
            <Typography> {`You have ${ownedCount} tags.`} </Typography>
            <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
              {"How many Tags would you"} <br />
              {"like to sell?"}
            </Typography>
            <Box>
              <Button variant="contained" onClick={decreaseSellCount}>
                <RemoveIcon />
              </Button>
              <TextField
                inputProps={{ sx: { textAlign: "center", padding: 1 } }}
                sx={{ width: 80 }}
                value={sellCount}
                onChange={handleSellCountChange}
              />
              <Button variant="contained" onClick={increaseSellCount}>
                <AddIcon />
              </Button>
            </Box>
            <Box style={ModalButtonBoxStyle}>
              <Button
                variant="contained"
                style={ModalButtonStyle}
                onClick={onAll}
              >
                All
              </Button>
              <Button
                variant="contained"
                color="success"
                style={ModalButtonStyle}
                onClick={onSell}
              >
                Sell
              </Button>
            </Box>
            <Typography>
              {`You'll get ${calc_sell_weth_from_count(sellCount)} WETH.`}
            </Typography>
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <Typography> {`You have ${ownedCount} tags.`} </Typography>
            <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
              {"How many Tags would you"} <br />
              {"like to buy?"}
            </Typography>
            <Box>
              <Button variant="contained" onClick={decreaseBuyCount}>
                <RemoveIcon />
              </Button>
              <TextField
                inputProps={{ sx: { textAlign: "center", padding: 1 } }}
                sx={{ width: 80 }}
                value={buyCount}
                onChange={handleBuyCountChange}
              />
              <Button variant="contained" onClick={increaseBuyCount}>
                <AddIcon />
              </Button>
            </Box>
            <Box style={ModalButtonBoxStyle}>
              <Button
                variant="contained"
                style={ModalButtonStyle}
                onClick={onBuy}
                color="error"
              >
                Buy
              </Button>
            </Box>
            <Typography>
              {`Cost ${calc_buy_weth_from_count(buyCount)} WETH.`}
            </Typography>
          </TabPanel>
        </Box>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

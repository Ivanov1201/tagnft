import { Route, Routes } from "react-router-dom";
import React from "react";
import { Home } from "../pages/home";
import { Login } from "../pages/login";
import { Mint } from "../pages/mint";

function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/terrace" element={<Mint />}></Route>
    </Routes>
  );
}

export default AppRoute;

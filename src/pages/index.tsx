import React from "react";
import AppRoute from "../route";
import { BrowserRouter as Router } from "react-router-dom";

function Layout() {
  return (
    <>
      <Router>
        <AppRoute />
      </Router>
    </>
  );
}

export default Layout;

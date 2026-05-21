import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router";

// Page import
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Report from "../pages/Report";
import Transactions from "../pages/Transactions";
import MasterPage from "../pages/MasterPage";

import Budgets from "../pages/Budgets";
import Loans from "../pages/Loans";

const routesList = [
  { path: "/", element: Dashboard },
  { path: "/register", element: Register },
  { path: "/login", element: Login },
  { path: "/profile", isPrivate: true, element: Profile },
  { path: "/report", isPrivate: true, element: Report },
  { path: '/transactions', isPrivate: true, element: Transactions },
  { path: '/master', isPrivate: true, element: MasterPage },
  { path: '/budgets', isPrivate: true, element: Budgets },
  { path: '/loans', isPrivate: true, element: Loans },
  { path: "*", element: Dashboard },
];

function RoutesComponent() {
  const [valideRoutes, setValideRoutes] = useState([]);
  let authenticationToken = localStorage.getItem("authentication-token");
  useEffect(() => {
    if (authenticationToken) {
      setValideRoutes(routesList);
    } else {
      setValideRoutes(routesList.filter((route) => !route.isPrivate));
    }
  }, []);
  return (
    <Routes>
      {valideRoutes.map((ele) => (
        <Route path={ele.path} element={<ele.element />} />
      ))}
    </Routes>
  );
}

export default RoutesComponent;

import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Welcome from "../components/Welcome";
import Plans from "../components/Plans";
import Hospitals from "../components/Hospitals";
import HospitalInfo from "../components/HospitalInfo";
import PrivateRouteGuest from "../components/PrivateRouteGuest";

const Dashboard = () => {
  const username = sessionStorage.getItem("user");
  return (
    <div>
      <Header />
      <Routes>
        <Route path="" element={<Welcome username={username} />} />
        <Route
          path="plans"
          element={
            <PrivateRouteGuest>
              <Plans />
            </PrivateRouteGuest>
          }
        />
        <Route path="hospitals" element={<Hospitals />} />
        <Route path="hospital-info" element={<HospitalInfo />} />
      </Routes>
    </div>
  );
};

export default Dashboard;

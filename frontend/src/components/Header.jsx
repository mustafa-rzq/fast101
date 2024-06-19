import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const handleLogOut = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:8000/api/logout", {});
      if (response.data) {
        localStorage.removeItem("token");
        localStorage.removeItem("userid");
        localStorage.removeItem("guest");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("guest");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const token = localStorage.getItem("token");
  const handleRoute = () => {
    if (!token) {
      alert("Please login to leave feedback");
    }
    window.scrollTo(0, 0);
  };
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <nav className="bg-gray-100 md:p-3 p-4 px-5 md:px-36 fixed w-full z-10">
        <div className="container mx-auto md:flex md:items-center md:justify-between text-center">
          <NavLink
            to=""
            className="text-red-600 text-2xl md:text-4xl tracking-widest md:tracking-wider font-bold"
            onClick={handleClick}
          >
            Dashboard
          </NavLink>
          <div className="md:flex md:items-center md:w-auto hidden">
            <NavLink
              to="/dashboard/plans"
              className="text-red-600 hover:text-red-800 mr-6 text-xl font-bold"
              onClick={handleRoute}
            >
              Treatment
            </NavLink>
            <NavLink
              to="/dashboard/hospitals"
              className="text-red-600 hover:text-red-800 text-xl font-bold mr-6"
              onClick={handleClick}
            >
              Find Hospitals
            </NavLink>
            <button
              className="text-white hover:bg-red-700 text-lg font-bold bg-red-600 p-1 px-3 rounded-lg"
              onClick={handleLogOut}
            >
              Back to Log In
            </button>
          </div>
          <div className="md:hidden items-center mt-4">
            <NavLink
              to="/dashboard/plans"
              className="text-red-600 md:hover:text-red-800 mr-12 text-md"
              onClick={handleClick}
            >
              Treatment
            </NavLink>
            <NavLink
              to="/dashboard/hospitals"
              className="text-red-600 md:hover:text-red-800 text-md mr-12"
              onClick={handleClick}
            >
              Find Hospitals
            </NavLink>
            <button
              className="text-white hover:bg-red-700 text-lg font-bold bg-red-600 p-2 px-3 rounded-lg"
              onClick={handleLogOut}
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;

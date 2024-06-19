import React from "react";
import { NavLink } from "react-router-dom";

const Welcome = (props) => {
  const token = localStorage.getItem("token");
  const handleRoute = () => {
    if (!token) {
      alert("Please login to leave feedback");
    }
    window.scrollTo(0, 0);
  };
  return (
    <div className="flex justify-center pt-44">
      <div className="bg-gray-200 text-red-600 rounded-xl p-10 py-24 w-10/12 mx-auto flex flex-col items-center border-2 border-gray-300">
        <div className="flex w-full items-center justify-around">
          <div className="flex flex-col items-start mr-6">
            <h2 className="text-4xl font-semibold mb-4 text-black">Welcome</h2>
            <h1 className="text-6xl font-extrabold tracking-wider mb-8">
              {props.username}
            </h1>
          </div>
          <div className="border-black h-40 mx-6 border-l-2"></div>
          <div className="flex flex-col items-start ml-6">
            <p className="text-lg mb-4 text-black">
              Welcome to Fast101. Here you can find various
              features and tools to assist you.
            </p>
            <p className="text-lg mb-8 text-black">
              Please explore the treatment plans and customize them according to
              your needs, or look for lookup up nearby hospitals to find which one suits you best
            </p>
            <div className="flex">
              <NavLink
                to="/dashboard/plans"
                onClick={handleRoute}
                className="text-white hover:bg-red-700 text-xl font-bold bg-red-600 p-2 px-3 rounded-lg mr-4"
              >
                Treatment Plans
              </NavLink>
              <NavLink
                to="/dashboard/hospitals"
                className="text-white hover:bg-red-700 text-xl font-bold bg-red-600 p-2 px-3 rounded-lg"
              >
                Find Hospitals
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

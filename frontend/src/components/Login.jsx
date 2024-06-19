import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        formData
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user", response.data.user);
        localStorage.setItem("userid", response.data.userid);
        navigate("/dashboard");
        setFormData({
          email: "",
          password: "",
        });
      } else {
        setError("Token not received");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.errors[0].msg);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };
  const handleGuestLogin = () => {
    localStorage.setItem("guest", true);
    sessionStorage.setItem("user", "Guest");
    navigate("/dashboard");
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-black">Log In</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-black"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-400 rounded-md py-2 pl-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-2"
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-800"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-400 rounded-md py-2 pl-2 shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm border-2"
            required
          />
        </div>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <button
          type="submit"
          className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 mt-2"
        >
          Log In
        </button>
      </form>
      <button
        onClick={handleGuestLogin}
        className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 mt-2"
      >
        Login as Guest
      </button>
    </div>
  );
};

export default Login;

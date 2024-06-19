import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
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
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/register",
        formData
      );
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.errors[0].msg);
      }
      console.error(
        "Error signing up:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-black">Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-black"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-400 rounded-md py-2 pl-2 focus:ring-red-500 focus:border-red-500 sm:text-sm border-2"
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="email"
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
            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm py-2 pl-2 focus:ring-red-500 focus:border-red-500 sm:text-sm border-2"
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-black"
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
            className="mt-1 block w-full border-gray-400 rounded-md shadow-sm py-2 pl-2 focus:ring-red-500 focus:border-red-500 sm:text-sm border-2"
            required
          />
        </div>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <button
          type="submit"
          className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 mt-2"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;

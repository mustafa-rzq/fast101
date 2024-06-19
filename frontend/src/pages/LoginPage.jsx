import { NavLink } from "react-router-dom";
import Login from "../components/Login";

const LoginPage = () => {
  return (
    <div className="container mx-auto md:flex md:py-36 md:px-40">
      <div>
        <h1 className="text-6xl font-extrabold text-red-600 pt-28 pb-2 text-center">
          Fast101 Healthcare Services
        </h1>
        <h3 className="text-black text-3xl md:pt-5 p-6 text-center">
          We Help You Find The Most Convenient Emergency Room
        </h3>
      </div>
      <div className="bg-white p-2 rounded-md shadow-2xl w-96 mx-auto">
        <Login />
        <p className="text-center mt-4 text-sm text-text-black">
          Don't have an account?{" "}
          <NavLink
            to="/signup"
            className="text-red-500 hover:underline focus:outline-none"
          >
            Sign Up here
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

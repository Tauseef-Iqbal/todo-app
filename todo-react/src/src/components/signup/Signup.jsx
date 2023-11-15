import React, { useState } from "react";
import "./Signup.css";
import Heading from "./Heading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const history = useNavigate();
  const [Inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/signup",
        Inputs
      );

      toast.success(response.data.message);
      setInputs({
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        if (
          error.response.data.errors[0].message ===
          "User already exists with the provided email"
        ) {
          history("/signin");
        } else {
          toast.error(error.response.data.errors[0].message);
        }
      } else {
        console.error("Error during signup:", error.message);
        toast.error("An error occurred during signup. Please try again.");
      }
    }
  };

  return (
    <div className="signup">
      <ToastContainer />
      <div className="container">
        <div className="row">
          <div className="col-lg-8 column d-flex justify-content-center align-items-center">
            <div className="d-flex flex-column w-100 p-5">
              <input
                className="p-2 my-3 input-signup"
                type="username"
                name="username"
                placeholder="Enter your Username"
                onChange={change}
                value={Inputs.username}
              />
              <input
                className="p-2 my-3 input-signup"
                type="email"
                name="email"
                placeholder="Enter your Email"
                onChange={change}
                value={Inputs.email}
              />
              <input
                className="p-2 my-3 input-signup"
                type="password"
                name="password"
                placeholder="Enter your Password"
                onChange={change}
                value={Inputs.password}
              />
              <button onClick={submit} className="btn-signup p-2">
                Sign Up
              </button>
            </div>
          </div>
          <div className="col-lg-4 column col-left d-flex justify-content-center align-items-center">
            <Heading first="Sign" second="Up"></Heading>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import React, { useState } from "react";
import "./Signup.css";
import Heading from "./Heading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { authActions } from "../../store";

const SignIn = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [Inputs, setInputs] = useState({
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
        "http://localhost:8000/api/v1/auth/login",
        Inputs
      );
      sessionStorage.setItem(
        "accessToken",
        response.data.userRecord.accessToken
      );
      dispatch(authActions.login());
      setInputs({
        email: "",
        password: "",
      });
      history("/todo");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        toast.error(`${error.response.data.errors[0].message}`);
      } else {
        toast.error("An error occurred during login. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="signup">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 column col-left d-flex justify-content-center align-items-center">
              <Heading first="Sign" second="In"></Heading>
            </div>
            <div className="col-lg-8 column d-flex justify-content-center align-items-center">
              <div className="d-flex flex-column w-100 p-5">
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
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

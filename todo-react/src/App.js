import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Footer from "./src/components/footer/Footer";
import Homepage from "./src/components/homepage/Homepage";
import Navbar from "./src/components/navbar/Navbar";
import Signup from "./src/components/signup/Signup";
import SignIn from "./src/components/signup/SignIn";
import Todo from "./src/components/todo/Todo";
import { authActions } from "./src/store";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {}, []);
  const accessToken = sessionStorage.getItem("accessToken");
  if (accessToken) {
    dispatch(authActions.login());
  }

  return (
    <div>
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route exact path="/" element={<Homepage />}></Route>
          <Route path="/todo" element={<Todo />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
        </Routes>
      </Router>
      <ToastContainer />
      <Footer></Footer>
    </div>
  );
}

export default App;

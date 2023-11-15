import React from "react";
import "./Homepage.css";

const Homepage = () => {
  return (
    <div className="homepage d-flex justify-content-center align-items-center">
      <div className="container d-flex justify-content-center align-items-center flex-column">
        <h1 className="text-center">
          Organize your <br />
          work and life finally!
        </h1>
        <p>
          Become organized, focused and calm with <br /> to-do app. It's out
          there for you
        </p>
        <button className="homepage-btn p-2">Make a Todo List</button>
      </div>
    </div>
  );
};

export default Homepage;

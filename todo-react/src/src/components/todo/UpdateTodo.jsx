import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

let accessToken = sessionStorage.getItem("accessToken");

const UpdateTodo = ({ display, update }) => {
  useEffect(() => {
    setInputs({
      title: update.title,
      body: update.body,
      completed: update.completed || false, // Set completed to update.completed or false if not present
    });
  }, [update]);

  const [Inputs, setInputs] = useState({
    title: "",
    body: "",
    completed: false,
  });

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs({
      ...Inputs,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/tasks/${update._id}`,
        Inputs,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success(response.data.message);
      display("none");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        toast.error(`${error.response.data.errors[0].message}`);
      } else {
        toast.error("An error occurred. Please try again");
      }
    }
  };

  return (
    <>
      <div>
        <div className="p-5 d-flex justify-content-center align-items-start flex-column update">
          <ToastContainer></ToastContainer>
          <h3>Update Your Task</h3>
          <input
            className="todo-inputs my-4 w-100 p-3"
            type="text"
            name="title"
            value={Inputs.title}
            onChange={change}
          />
          <textarea
            className="todo-inputs w-100 p-3"
            name="body"
            value={Inputs.body}
            onChange={change}
          />
          <div className="my-3">
            <label>
              Completed
              <input
                className="mx-2"
                type="checkbox"
                name="completed"
                checked={Inputs.completed}
                onChange={change}
              />
            </label>
          </div>
          <div>
            <button onClick={submit} className="btn btn-dark my-4">
              Update
            </button>
            <button
              onClick={() => display("none")}
              className="btn btn-danger my-4 mx-3"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateTodo;

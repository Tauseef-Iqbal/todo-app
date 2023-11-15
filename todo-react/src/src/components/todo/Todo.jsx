import React, { useState, useEffect } from "react";
import "./Todo.css";
import TodoCards from "./TodoCards";
import { ToastContainer, toast } from "react-toastify";
import UpdateTodo from "./UpdateTodo.jsx";
import axios from "axios";

let accessToken = sessionStorage.getItem("accessToken");
let toUpdateTasks = [];

const Todo = () => {
  const [Inputs, setInputs] = useState({
    title: "",
    body: "",
    completed: false,
  });
  const [Tasks, setTasks] = useState([]);

  const show = () => {
    document.getElementById("taxarea").style.display = "block";
  };

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const submit = async () => {
    try {
      if (accessToken) {
        const response = await axios.post(
          "http://localhost:8000/api/v1/tasks",
          Inputs,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        toast.success(response.data.message);
        setTasks([...Tasks, response.data.addedTask]);
      } else {
        setTasks([...Tasks, Inputs]);
        toast.error("Your task is not saved yet. Please Sign Up");
      }

      setInputs({ title: "", body: "", completed: false });
    } catch (error) {
      console.log('error', error);
      if (error.response && error.response.data && error.response.data.errors) {
        toast.error(`${error.response.data.errors[0].message}`);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      if (id) {
        const response = await axios.delete(
          `http://localhost:8000/api/v1/tasks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        toast.success(response.data.message);
        setTasks(Tasks.filter((task) => task._id !== id));
      } else {
        toast.error("Error deleting the task");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        toast.error(`${error.response.data.errors[0].message}`);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const updateTask = async (index) => {
    toUpdateTasks = Tasks[index];
  };

  const display = (value) => {
    document.getElementById("todo-update").style.display = value;
  };

  useEffect(() => {
    const getAllTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/tasks", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTasks(response.data.data);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          toast.error(`${error.response.data.errors[0].message}`);
        } else {
          toast.error("An error occurred");
        }
      }
    };

    getAllTasks();
  }, [submit]);

  return (
    <>
      <div className="todo">
        <ToastContainer />
        <div className="todo-main container d-flex justify-content-center align-items-center my-4 flex-column">
          <div className="d-flex flex-column todo-inputs-div w-50 p-1">
            <input
              onClick={show}
              onChange={change}
              type="text"
              name="title"
              value={Inputs.title}
              placeholder="Title"
              className="my-2 p-2 todo-inputs"
            />
            <textarea
              onChange={change}
              id="taxarea"
              type="text"
              name="body"
              value={Inputs.body}
              placeholder="Body"
              className="p-2 todo-inputs"
            />
          </div>
          <div className="w-50 d-flex justify-content-end my-3">
            <button onClick={submit} className="btn btn-secondary px-4 py-2">
              Add
            </button>
          </div>
        </div>
        <div className="todo-body">
          <div className="container-fluid">
            <div className="row">
              {Tasks &&
                Tasks.map((item, index) => (
                  <div className="col-lg-3 col-10 mx-5 my-2" key={index}>
                    <TodoCards
                      title={item.title}
                      body={item.body}
                      id={item._id}
                      display={display}
                      delid={deleteTask}
                      updateid={index}
                      toBeUpdate={updateTask}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="todo-update" id="todo-update">
        <div className="container update">
          <UpdateTodo display={display} update={toUpdateTasks} />
        </div>
      </div>
    </>
  );
};

export default Todo;

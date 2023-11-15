import React from "react";
import { MdDelete } from "react-icons/md";
import { GrDocumentUpdate } from "react-icons/gr";

const TodoCards = ({
  title,
  body,
  id,
  delid,
  display,
  updateid,
  toBeUpdate,
}) => {
  return (
    <div className="p-3 todo-card">
      <div>
        <h5>{title}</h5>
        <p className="todo-card-p">{body.split("", 50)}...</p>
      </div>
      <div className="d-flex justify-content-around">
        <div className="d-flex">
          <div
            className="d-flex justify-content-center align-items-center card-icon-head px-2 py-1"
            onClick={() => {
              display("block");
              toBeUpdate(updateid);
            }}
          >
            <GrDocumentUpdate className="card-icons" />
            Update
          </div>
          <div className="mx-5"></div>
          <div
            onClick={() => {
              delid(id);
            }}
            className="d-flex justify-content-center align-items-center card-icon-head px-2 py-1 text-danger"
          >
            <MdDelete className="card-icons del" />
            Delete
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoCards;

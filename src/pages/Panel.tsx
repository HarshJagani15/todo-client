import React, { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { Todo } from "./Todo";
import {
  addTodo,
  deletePanel,
  editPanel,
  IPanel,
  ITodos,
} from "../store/slices/panel/panel.slice";
import { Field, Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "../store/hooks";

interface PanelProps {
  searchTodoValue: string;
  setSearchTodoValue: (value: string) => void;
  isTodoAdding: boolean;
  setIsTodoAdding: (value: boolean) => void;
  setIsPanelAdding: (value: boolean) => void;
  index: number;
  panel: IPanel;
  setIsOpen: (value: boolean) => void;
  setDialogBoxTodo: (value: ITodos) => void;
  moveTodo: (
    todoId: string,
    sourcePanelId: string,
    targetPanelId: string
  ) => void;
}

const TodoSchema: Yup.ObjectSchema<{ heading: string }> = Yup.object().shape({
  heading: Yup.string().required("This field is required!"),
});

const PanelNameSchema: Yup.ObjectSchema<{ panelname: string }> =
  Yup.object().shape({
    panelname: Yup.string().required("Required"),
  });

export const PanelPage: React.FC<PanelProps> = ({
  index,
  panel,
  moveTodo,
  setIsOpen,
  setDialogBoxTodo,
  isTodoAdding,
  setIsTodoAdding,
  setIsPanelAdding,
}) => {
  const dispatch = useAppDispatch();

  const [isPanelEditing, setIsPanelEditing] = useState<boolean>(false);
  const [isPanelDeleting, setIsPanelDeleting] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const handlePanelDelete = (panelID: string) => {
    dispatch(deletePanel({ _id: panelID }));
  };

  const handlePanelEdit = (values: { panelname: string }) => {
    dispatch(
      editPanel({
        _id: panel._id,
        name: values.panelname,
      })
    );
    setIsPanelEditing(false);
  };

  const handleAddTodos = (
    values: { heading: string },
    formikHelpers: FormikHelpers<{ heading: string }>
  ) => {
    dispatch(addTodo({ heading: values.heading, _id: panel._id }));
    setIsTodoAdding(false);
    formikHelpers.setSubmitting(false);
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TODO",
    drop: (item: { todoId: string; sourcePanelId: string }) => {
      moveTodo(item.todoId, item.sourcePanelId, panel._id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  drop(ref);
  return (
    <React.Fragment>
      {index === 0 ? (
        <div>
          <div className="flex justify-between items-center p-3">
            <span
              onClick={() => {
                setIsTodoAdding(!isTodoAdding);
                setIsPanelAdding(false);
              }}
              className="text-sm bg-blue-700 text-white px-2  py-[3px] cursor-pointer"
            >
              <span>AddTodo </span>
              <FontAwesomeIcon icon={faPlus} className="cursor-pointer" />
            </span>
          </div>
          {isTodoAdding ? (
            <div className=" pb-6">
              <Formik
                initialValues={{
                  heading: "",
                }}
                onSubmit={handleAddTodos}
                validationSchema={TodoSchema}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className=" shadow-md rounded-md flex gap-6 p-2">
                      <div>
                        <Field
                          type="text"
                          name="heading"
                          id="heading"
                          className="focus:outline-none bg-white border-[1px] border-black  w-full"
                        />
                        {errors.heading && touched.heading && (
                          <div className="text-red-600 text-base">
                            {errors.heading}
                          </div>
                        )}
                      </div>
                      <button
                        type="submit"
                        className="bg-blue-800 text-white px-4 h-[27px]"
                      >
                        Add
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          ) : null}
        </div>
      ) : null}
      <div
        ref={ref}
        className={`panel ${isOver ? "panel-over" : ""} flex flex-col gap-6`}
        style={{
          border: isOver ? "2px solid green" : "2px solid lightgray",
          padding: "10px",
          margin: "10px",
        }}
      >
        <div className="flex flex-col">
          {isPanelEditing ? (
            <Formik
              initialValues={{
                panelname: panel.name,
              }}
              onSubmit={handlePanelEdit}
              validationSchema={PanelNameSchema}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="flex justify-between shadow-md rounded-md p-2">
                    <div className="flex flex-col">
                      <Field
                        type="text"
                        name="panelname"
                        id="panelname"
                        className="focus:outline-none bg-white border-[1px] w-32 border-black"
                      />
                      {errors.panelname && touched.panelname && (
                        <div className="text-black text-base">
                          {errors.panelname}
                        </div>
                      )}
                    </div>
                    <div>
                      <Field
                        type="submit"
                        value="Edit"
                        className="bg-yellow-300 px-2 cursor-pointer"
                      />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="flex justify-between bg-white p-2">
              <div className="">
                <span className=" px-2 text-[15px] capitalize font-medium ">
                  {panel.name}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <FontAwesomeIcon
                  onClick={() => {
                    setIsPanelEditing(true);
                  }}
                  icon={faEdit}
                  className="cursor-pointer text-blue-700"
                />

                <FontAwesomeIcon
                  onClick={() => setIsPanelDeleting(true)}
                  icon={faTrash}
                  className="cursor-pointer text-red-600"
                />
                {isPanelDeleting ? (
                  <div
                    className="fixed inset-0 flex justify-center
                        bg-black bg-opacity-50"
                  >
                    <div className="bg-white p-6 h-fit absolute top-16 flex flex-col gap-2">
                      <span className="text-lg font-medium">
                        Are sure want to delete all the todos of panel?
                      </span>
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-600 w-fit px-2 py-[1px] text-white"
                          type="button"
                          onClick={() => handlePanelDelete(panel._id)}
                        >
                          Confirm
                        </button>
                        <button
                          className="bg-yellow-400 w-fit px-2 py-[2px]"
                          type="button"
                          onClick={() => setIsPanelDeleting(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-[6px] max-h-60 overflow-y-scroll">
          {panel?.todos?.map((todo) => (
            <Todo
              key={todo._id}
              todo={todo}
              sourcePanelId={panel._id}
              setIsOpen={setIsOpen}
              setDialogBoxTodo={setDialogBoxTodo}
            />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

import React, { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { Todo } from "./Todos/Index";
import {
  addTodoAsync,
  deletePanelAsync,
  editPanelAsync,
} from "../../slices/panel/panel.slice";
import { IPanelProps } from "../../slices/panel/panel.model";
import { Field, Formik, Form, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "../../store";
import { MESSAGE } from "../../utils/constants";

const initialTodoValue = {
  heading: "",
};

const initialPanelValue = (panelname: string) => ({ panelname });

const validationTodoSchema: Yup.ObjectSchema<{ heading: string }> =
  Yup.object().shape({
    heading: Yup.string().required(MESSAGE.FIELD_REQUIRED),
  });

const validationPanelNameSchema: Yup.ObjectSchema<{ panelname: string }> =
  Yup.object().shape({
    panelname: Yup.string().required(MESSAGE.FIELD_REQUIRED),
  });

export const PanelPage: React.FC<IPanelProps> = ({
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

  const ref = useRef<HTMLDivElement>(null);
  const [isPanelEditing, setIsPanelEditing] = useState<boolean>(false);
  const [isPanelDeleting, setIsPanelDeleting] = useState<boolean>(false);

  const handlePanelDelete = (panelID: string) => {
    dispatch(deletePanelAsync({ _id: panelID }));
  };

  const handlePanelEdit = (values: { panelname: string }) => {
    dispatch(
      editPanelAsync({
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
    dispatch(addTodoAsync({ heading: values.heading, _id: panel._id }));
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
                setIsPanelEditing(false);
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
                initialValues={initialTodoValue}
                onSubmit={handleAddTodos}
                validationSchema={validationTodoSchema}
              >
                <Form>
                  <div className=" shadow-md rounded-md flex gap-6 p-2">
                    <div>
                      <Field
                        type="text"
                        name="heading"
                        id="heading"
                        className="focus:outline-none bg-white border-[1px] border-black  w-full"
                      />
                      <ErrorMessage
                        name="heading"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-800 text-white px-4 h-[27px]"
                    >
                      Add
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>
          ) : null}
        </div>
      ) : null}
      <div
        ref={ref}
        className={`p-[10px] m-[10px] border-2 flex flex-col gap-6 ${
          isOver ? "border-green-500" : "border-gray-300"
        }
        `}
      >
        <div className="flex flex-col">
          {isPanelEditing ? (
            <Formik
              initialValues={initialPanelValue(panel.name)}
              onSubmit={handlePanelEdit}
              validationSchema={validationPanelNameSchema}
            >
              <Form>
                <div className="flex justify-between shadow-md rounded-md p-2">
                  <div className="flex flex-col">
                    <Field
                      type="text"
                      name="panelname"
                      id="panelname"
                      className="focus:outline-none bg-white border-[1px] w-32 border-black"
                    />
                    <ErrorMessage
                      name="panelname"
                      component="div"
                      className="text-red-600 text-base"
                    />
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
                    setIsTodoAdding(false);
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

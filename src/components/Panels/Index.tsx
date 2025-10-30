import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { PanelPage } from "./Panel";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  addCommentAsync,
  addPanelAsync,
  changeDescriptionAsync,
  changeTodoHeadingAsync,
  deleteCommentAsync,
  updateTodoStatusAsync,
  editCommentAsync,
  fetchPanelsAsync,
} from "../../slices/panel/panel.slice";
import { IParams, ITodos } from "../../slices/panel/panel.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";
import Dialog from "../common/Dialog";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  faShareNodes,
  faXmark,
  faArrowDownWideShort,
  faChevronDown,
  faBoltLightning,
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from "formik";
import debounce from "lodash/debounce";
import { useSearchParams } from "react-router-dom";
import Select from "../common/Select";
import { defaultImage } from "../../utils/image";
import star from "../../images/star.png";
import { MESSAGE, OPTIONS } from "../../utils/constants";

const initialCommentValue = {
  comment: "",
};

const initialPanelValue = {
  panelname: "",
};

const validationHeadingSchema = Yup.object().shape({
  heading: Yup.string().required(MESSAGE.FIELD_REQUIRED),
});

const validationCommentSchema = Yup.object().shape({
  comment: Yup.string().required(MESSAGE.FIELD_REQUIRED),
});

const validationPanelSchema = Yup.object().shape({
  panelname: Yup.string().required(MESSAGE.FIELD_REQUIRED),
});

const formateDate = (date: string) => {
  if (!date) return;
  return new Date(date).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
};

const Panels = () => {
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDetailsVisible, setIsDetailVisible] = useState<boolean>(false);
  const [dialogBoxTodo, setDialogBoxTodo] = useState<null | ITodos>(null);
  const [dialogBoxDescription, setDialogBoxDescription] = useState<string>("");
  const [dropdown, setdropdown] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchTodoValue, setSearchTodoValue] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [isTodoAdding, setIsTodoAdding] = useState<boolean>(false);
  const [commentEditIndex, setCommentEditIndex] = useState<string | null>(null);
  const [commentEmptyError, setCommentEmptyError] = useState<string>("");
  const [commentValue, setComment] = useState<string>("");
  const { panels } = useAppSelector((state) => state.panel);
  const [isPanelAdding, setIsPanelAdding] = useState<boolean>(false);
  const men = defaultImage();

  const debouncedDispatch = useMemo(() => {
    return debounce((params: IParams) => {
      dispatch(fetchPanelsAsync(params));
    }, 500);
  }, [dispatch]);

  useEffect(() => {
    let params: IParams = {
      search: "",
    };
    if (searchParams) {
      params.search = searchParams.get("search");
    }
    setSearchValue(params.search);
    debouncedDispatch(params);
  }, [searchParams, debouncedDispatch]);

  const handleSearchParams = (value: string) => {
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams();
    }
  };

  const handleTodoHeading = async (
    values: { heading: string },
    helpers: FormikHelpers<{ heading: string }>
  ) => {
    const result = await dispatch(
      changeTodoHeadingAsync({
        heading: values.heading,
        _id: dialogBoxTodo?._id!,
      })
    ).unwrap();

    if (result) {
      setDialogBoxTodo((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          histories: result.history,
        };
      });
    }
    helpers.setSubmitting(false);
  };

  const handleDescription = async (
    values: { description: string },
    helpers: FormikHelpers<{ description: string }>
  ) => {
    const result = await dispatch(
      changeDescriptionAsync({
        description: values.description,
        _id: dialogBoxTodo?._id!,
      })
    ).unwrap();

    if (result) {
      setDialogBoxTodo((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          histories: result.history,
        };
      });
    }
    helpers.setSubmitting(false);
  };

  const handleCommemt = async (
    values: { comment: string },
    helpers: FormikHelpers<{ comment: string }>
  ) => {
    const response = await dispatch(
      addCommentAsync({
        comment: values.comment!,
        _id: dialogBoxTodo?._id!,
      })
    ).unwrap();

    if (response) {
      setDialogBoxTodo((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          comments: [
            ...prev.comments,
            {
              _id: response.comment._id,
              date: response.comment.date,
              comment: response.comment.comment,
            },
          ],
        };
      });
      helpers.resetForm();
    }
  };

  const handleEditComment = async (commentId: string) => {
    const response = await dispatch(
      editCommentAsync({
        todo_id: dialogBoxTodo?._id!,
        comment: commentValue,
        _id: commentId,
      })
    ).unwrap();

    setDialogBoxTodo((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        comments: prev?.comments?.map((comment, index) =>
          comment._id === response.commentId
            ? {
                _id: response.commentId,
                date: Date.now(),
                comment: response.newUpdatedComment,
              }
            : comment
        ),
      };
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    console.log(dialogBoxTodo?._id);
    const response = await dispatch(
      deleteCommentAsync({
        todo_id: dialogBoxTodo?._id!,
        comment_id: commentId,
      })
    ).unwrap();

    setDialogBoxTodo((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        comments: prev.comments.filter(
          (comment, index) => comment._id !== response.commentId
        ),
      };
    });
  };

  const handleAddPanel = (values: { panelname: string }) => {
    const name = values.panelname;
    dispatch(addPanelAsync({ name }));
    setIsPanelAdding(false);
  };

  const moveTodo = (
    todoId: string,
    sourcePanelId: string,
    targetPanelId: string
  ) => {
    dispatch(updateTodoStatusAsync({ todoId, sourcePanelId, targetPanelId }));
  };

  const Content = () => {
    return (
      <div className="flex flex-col gap-10 w-[850px] bg-white p-10 overflow-y-scroll h-[600px]">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-lg font-semibold">
              Title
            </label>

            <Formik
              initialValues={{
                heading: dialogBoxTodo?.heading,
              }}
              validationSchema={validationHeadingSchema}
              onSubmit={handleTodoHeading}
            >
              <Form className="flex gap-8">
                <div className="flex flex-col">
                  <Field
                    type="text"
                    name="heading"
                    id="heading"
                    placeholder="Add a heading..."
                    className="focus:outline-none text-base py-1 w-64 bg-gray-100"
                  />
                  <ErrorMessage name="heading" component="div" />
                </div>
                <Field
                  type="submit"
                  value="Save"
                  className="bg-blue-700 text-white px-3 py-[1px] h-fit"
                />
              </Form>
            </Formik>
          </div>
          <div className="border-red-600 border-2 w-fit self-start rounded-lg px-6 py-2 text-lg flex gap-4 text-center items-center ">
            <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
            <FontAwesomeIcon icon={faShareNodes}></FontAwesomeIcon>
            <FontAwesomeIcon
              icon={faXmark}
              onClick={() => {
                setDialogBoxTodo(null);
                setIsOpen(false);
              }}
            ></FontAwesomeIcon>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-row justify-between gap-14 ">
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-lg font-semibold">
                Description
              </label>
              <Formik
                initialValues={{
                  description: dialogBoxTodo?.description,
                }}
                onSubmit={handleDescription}
              >
                <Form className="flex flex-col gap-4">
                  <div className="flex flex-col ">
                    <Field
                      as="textarea"
                      name="description"
                      rows={3}
                      id="description"
                      placeholder="Add a description..."
                      className="focus:outline-none text-base py-1 w-[345px] bg-gray-100 resize-none"
                    />
                  </div>
                  <Field
                    type="submit"
                    value="Save"
                    className="bg-blue-700 text-white px-4 py-[1px] h-fit w-fit self-end"
                  />
                </Form>
              </Formik>
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <Select
                  name={"todo_dropdown"}
                  defaultOption={"To Do"}
                  options={OPTIONS.DIALOG_TODO_DROPDOWN}
                  className={
                    "focus:outline-none bg-[#eeeeee] py-[5px] px-3 text-center font-semibold text-base w-fit text"
                  }
                />
                <div className="ml-6 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBoltLightning}></FontAwesomeIcon>

                  <Select
                    name={"Actions"}
                    defaultOption={"Actions"}
                    options={OPTIONS.DIALOG_ACTIONS}
                    className={
                      "focus:outline-none text-center  font-medium w-fit"
                    }
                  />
                </div>
                <div className="flex flex-col gap-5 w-72  border-2 rounded-sm border-gray-300 border-collapse">
                  <div
                    onClick={() => setIsDetailVisible(!isDetailsVisible)}
                    className="flex justify-between items-center border-b-2 rounded-sm border-gray-300 px-4 py-2"
                  >
                    <button type="button">Details</button>
                    <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                  </div>
                  {isDetailsVisible ? (
                    <div className="flex flex-col px-4">
                      <label htmlFor="" className="font-medium">
                        Labels
                      </label>
                      <span>None</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold ">Activity</h3>
              <div className="text-base flex gap-4 items-center justify-between">
                <div className="flex items-center">
                  <label htmlFor="">Show:</label>

                  <Select
                    name={"activity"}
                    value={dropdown}
                    setValue={setdropdown}
                    options={OPTIONS.DIALOG_ACTIVITY}
                    className={
                      "focus:outline-none text-center  font-medium w-fit"
                    }
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <label htmlFor="">Newest first</label>
                  <FontAwesomeIcon
                    icon={faArrowDownWideShort}
                  ></FontAwesomeIcon>
                </div>
              </div>
            </div>
            {dropdown === "comments" ? (
              <div className="flex flex-col gap-3">
                <ul className="flex flex-col gap-2">
                  {dialogBoxTodo?.comments?.map((comment, index) => {
                    const diffInMs = Date.now() - comment?.date!;

                    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
                    const minutes = Math.floor(
                      (diffInMs % (1000 * 60 * 60)) / (1000 * 60)
                    );
                    const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
                    return (
                      <li className="flex flex-col">
                        <div className="flex gap-2">
                          <img
                            src={defaultImage()}
                            alt="img"
                            className="size-8"
                          />
                          <div>
                            <div className="flex gap-2 text-[14px]">
                              <span className="font-medium">Emma</span>
                              <div>
                                {hours === 0
                                  ? minutes !== 0
                                    ? `${minutes} minute ago`
                                    : `${seconds} second ago`
                                  : `${hours} hour ago`}
                              </div>
                            </div>
                            <div className="text-[14px]">
                              {comment?._id === commentEditIndex ? (
                                <form action="">
                                  <input
                                    type="text"
                                    value={commentValue}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="focus:outline-none border-2 border-gray-300"
                                  />
                                  {commentEmptyError !== ""
                                    ? commentEmptyError
                                    : null}
                                </form>
                              ) : (
                                comment?.comment
                              )}
                            </div>
                            <div className="flex gap-2 text-[14px]">
                              {commentEditIndex === comment._id ? (
                                <span
                                  className="cursor-pointer"
                                  onClick={() => {
                                    if (commentValue !== "") {
                                      handleEditComment(comment._id);
                                      setCommentEditIndex(null);
                                      setCommentEmptyError("");
                                    } else {
                                      setCommentEmptyError("Required");
                                    }
                                  }}
                                >
                                  Save
                                </span>
                              ) : (
                                <span
                                  onClick={() => {
                                    setCommentEditIndex(comment._id);
                                    setComment(comment.comment);
                                  }}
                                  className="cursor-pointer"
                                >
                                  Edit
                                </span>
                              )}
                              <span
                                onClick={() => handleDeleteComment(comment._id)}
                                className="cursor-pointer"
                              >
                                Delete
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex items-start gap-3">
                  <img src={men} alt="img" className="size-8" />
                  <Formik
                    initialValues={initialCommentValue}
                    validationSchema={validationCommentSchema}
                    onSubmit={handleCommemt}
                  >
                    <Form className="flex gap-2 items-start">
                      <div className="flex flex-col">
                        <Field
                          type="text"
                          name="comment"
                          id="comment"
                          placeholder="Add a comment..."
                          className="px-6 py-[1px] border-2 border-gray-400 text-base"
                        />
                        <ErrorMessage name="comment" component="div" />
                      </div>
                      <Field
                        type="submit"
                        value={"Add"}
                        className="bg-blue-700 text-white px-3 py-[1px] h-fit"
                      />
                    </Form>
                  </Formik>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white shadow-md rounded-lg max-h-40 relative">
                <table className="w-full border-collapse ">
                  <thead className="bg-gray-100 text-gray-600 text-sm uppercase font-medium sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left">Time</th>
                      <th className="px-6 py-3 text-left">Field</th>
                      <th className="px-6 py-3 text-left">Editor</th>
                      <th className="px-6 py-3 text-left">Changes</th>
                    </tr>
                  </thead>

                  <tbody className="text-gray-700 text-sm overflow-y-scroll">
                    {dialogBoxTodo?.histories?.map((history, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 transition h-auto"
                      >
                        <td className="px-6 py-3">
                          {formateDate(history?.timestamp)}
                        </td>
                        <td className="px-6 py-3 font-medium">
                          {history.field}
                        </td>
                        <td className="px-6 py-3">
                          <img
                            src={men}
                            alt="Editor"
                            className="w-8 h-8 rounded-full border border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-3">
                          {history.field === "Description" ? (
                            <div className="flex gap-2">
                              <span className="flex">
                                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-md line-through">
                                  {history.previous?.description}
                                </span>
                                <svg
                                  className="w-6 h-6 text-gray-800 dark:text-white"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 12H5m14 0-4 4m4-4-4-4"
                                  />
                                </svg>
                              </span>
                              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-md">
                                {history.updated?.description}
                              </span>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <span>
                                <span className="flex">
                                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-md line-through">
                                    {history.previous?.heading}
                                  </span>
                                  <svg
                                    className="w-6 h-6 text-gray-800 dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M19 12H5m14 0-4 4m4-4-4-4"
                                    />
                                  </svg>
                                </span>
                              </span>
                              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-md">
                                {history.updated?.heading}
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-10 flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-1">
          <img src={star} alt="img" className="h-8" />
          <h1 className="text-3xl font-medium">Design board</h1>
          <img src={star} alt="img" className="h-8" />
        </div>
        <FontAwesomeIcon icon={faEllipsis} className="size-5" />
      </div>

      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="relative">
            <input
              type="search"
              value={searchValue}
              className="focus:outline-none border-2 bg-[#eeeeee] border-gray-300 h-full pr-10 w-48 py-2"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchValue(e.target.value);
                handleSearchParams(e.target.value);
              }}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute right-3 top-3 text-gray-600"
            />
          </div>
          <div className="px-8">
            <Select
              name={"label"}
              defaultOption={"Label"}
              options={OPTIONS.LABEL}
            />
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium">GROUP BY :</label>

          <Select
            name={"gropuBy"}
            defaultOption={"None"}
            options={OPTIONS.GROUPBY}
          />
        </div>
      </div>
      <div className="relative flex gap-6 flex-col w-full">
        <div className="self-end flex flex-col gap-2">
          <button
            type="button"
            className="bg-blue-700 text-white px-2 py-[2px] self-end flex gap-2 items-center"
            onClick={() => {
              setIsPanelAdding(!isPanelAdding);
              setIsTodoAdding(false);
            }}
          >
            <span>Add Panel</span>
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <div>
            {isPanelAdding ? (
              <Formik
                initialValues={initialPanelValue}
                onSubmit={handleAddPanel}
                validationSchema={validationPanelSchema}
              >
                <Form>
                  <div className=" shadow-md rounded-md flex gap-6 p-2">
                    <div>
                      <Field
                        type="text"
                        name="panelname"
                        id="panelname"
                        className="focus:outline-none bg-white border-[1px] border-black  w-full"
                      />
                      <ErrorMessage
                        name="panelname"
                        component="div"
                        className="text-black text-base"
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
            ) : null}
          </div>
        </div>
        <DndProvider backend={HTML5Backend}>
          <div className="app-container">
            <div className="grid grid-cols-4 gap-6 ">
              {panels?.map((panel, i) => (
                <div className="flex flex-col bg-[#eeeeee] w-72 p-2 rounded-md shadow-sm ">
                  <PanelPage
                    index={i}
                    key={panel._id}
                    panel={panel}
                    moveTodo={moveTodo}
                    setIsOpen={setIsOpen}
                    setDialogBoxTodo={setDialogBoxTodo}
                    isTodoAdding={isTodoAdding}
                    setIsTodoAdding={setIsTodoAdding}
                    setIsPanelAdding={setIsPanelAdding}
                    searchTodoValue={searchTodoValue}
                    setSearchTodoValue={setSearchTodoValue}
                  />
                </div>
              ))}
            </div>
            <Dialog children={Content()} isOpen={isOpen} />
          </div>
        </DndProvider>
      </div>
    </div>
  );
};

export default Panels;

import { axiosInstance } from "../../config/axios-interceptor";
import {
  IAddComment,
  IAddPanel,
  IAddTodo,
  IChangeTodoDescription,
  IChangeTodoHeading,
  IDeleteComment,
  IDeletePanel,
  IUpdateTodoStatus,
  IEditComment,
  IEditPanel,
  IParams,
} from "./panel.model";

export const getAllPanels = async (payload: IParams) => {
  try {
    const response = await axiosInstance({
      method: "GET",
      url: "/panels",
      params: payload,
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const addNewPanel = async (payload: IAddPanel) => {
  try {
    const response = await axiosInstance({
      method: "POST",
      url: "/panels",
      data: payload,
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const updatePanelName = async (payload: IEditPanel) => {
  try {
    const response = await axiosInstance({
      method: "PUT",
      url: "/panels",
      data: payload,
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const removePanel = async (payload: IDeletePanel) => {
  try {
    const _id = payload._id;
    const response = await axiosInstance({
      method: "DELETE",
      url: `/panels/${_id}`,
    });
    return response.data.id;
  } catch (error: unknown) {
    throw error;
  }
};

export const addNewTodo = async (payload: IAddTodo) => {
  try {
    const response = await axiosInstance({
      method: "POST",
      url: `/todos`,
      data: payload,
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const updateTodoStatus = async (payload: IUpdateTodoStatus) => {
  try {
    const response = await axiosInstance({
      method: "POST",
      url: `/todos/update-todo-status`,
      data: payload,
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const updateTodoHeading = async (payload: IChangeTodoHeading) => {
  try {
    const response = await axiosInstance({
      method: "PUT",
      url: `/todos/heading`,
      data: payload,
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const updateTodoDescription = async (
  payload: IChangeTodoDescription
) => {
  try {
    const response = await axiosInstance({
      method: "PUT",
      url: `/todos/description`,
      data: payload,
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const addNewComment = async (payload: IAddComment) => {
  try {
    const response = await axiosInstance({
      method: "POST",
      url: `/todos/comment`,
      data: payload,
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const updateComment = async (payload: IEditComment) => {
  try {
    const response = await axiosInstance({
      method: "PUT",
      url: `/todos/comment`,
      data: payload,
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const deleteExistingComment = async (payload: IDeleteComment) => {
  try {
    const response = await axiosInstance({
      method: "DELETE",
      url: `/todos/comment?todo_id=${payload.todo_id}&comment_id=${payload.comment_id}`,
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addNewComment,
  addNewPanel,
  addNewTodo,
  deleteExistingComment,
  updateTodoStatus,
  getAllPanels,
  removePanel,
  updateComment,
  updatePanelName,
  updateTodoDescription,
  updateTodoHeading,
} from "./panel.api";
import axios from "axios";
import { toast } from "react-toastify";
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
  IPanel_InitialState,
  IParams,
} from "./panel.model";

export const fetchPanelsAsync = createAsyncThunk(
  "panels/fetchById",
  async (payload: IParams) => {
    try {
      const response = await getAllPanels(payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
    }
  }
);

export const addPanelAsync = createAsyncThunk(
  "panels/addPanel",
  async (payload: IAddPanel) => {
    try {
      const response = await addNewPanel(payload);
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
      throw error;
    }
  }
);

export const editPanelAsync = createAsyncThunk(
  "panels/editPanel",
  async (payload: IEditPanel) => {
    try {
      const response = await updatePanelName(payload);
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
      throw error;
    }
  }
);

export const deletePanelAsync = createAsyncThunk(
  "panels/deletePanel",
  async (payload: IDeletePanel) => {
    try {
      const response = await removePanel(payload);
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
      throw error;
    }
  }
);

export const addTodoAsync = createAsyncThunk(
  "panels/addTodo",
  async (payload: IAddTodo) => {
    try {
      const response = await addNewTodo(payload);
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
    }
  }
);

export const updateTodoStatusAsync = createAsyncThunk(
  "panels/update-todo-status",
  async (payload: IUpdateTodoStatus) => {
    try {
      const response = await updateTodoStatus(payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
    }
  }
);

export const changeTodoHeadingAsync = createAsyncThunk(
  "panels/changeHeading",
  async (payload: IChangeTodoHeading) => {
    try {
      const response = await updateTodoHeading(payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
    }
  }
);

export const changeDescriptionAsync = createAsyncThunk(
  "panels/changeDescription",
  async (payload: IChangeTodoDescription) => {
    try {
      const response = await updateTodoDescription(payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
    }
  }
);

export const addCommentAsync = createAsyncThunk(
  "panels/addComment",
  async (payload: IAddComment) => {
    try {
      const response = await addNewComment(payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
    }
  }
);

export const editCommentAsync = createAsyncThunk(
  "panels/editComment",
  async (payload: IEditComment) => {
    try {
      const response = await updateComment(payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
    }
  }
);

export const deleteCommentAsync = createAsyncThunk(
  "panels/deleteComment",
  async (payload: IDeleteComment) => {
    try {
      const response = await deleteExistingComment(payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
    }
  }
);

const initialState: IPanel_InitialState = {
  panels: [],
};

const panelSlice = createSlice({
  name: "panel",
  initialState,
  reducers: {
    panel: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPanelsAsync.pending, (state, action) => {})
      .addCase(fetchPanelsAsync.rejected, (state, action) => {})
      .addCase(fetchPanelsAsync.fulfilled, (state, action) => {
        state.panels = action.payload;
      })

      .addCase(addPanelAsync.pending, (state, action) => {})
      .addCase(addPanelAsync.rejected, (state, action) => {})
      .addCase(addPanelAsync.fulfilled, (state, action) => {
        state.panels.push({ ...action.payload });
      })

      .addCase(editPanelAsync.pending, (state, action) => {})
      .addCase(editPanelAsync.rejected, (state, action) => {})
      .addCase(editPanelAsync.fulfilled, (state, action) => {
        const { panel_name, panel_id } = action.payload;
        state.panels?.map((panel) => {
          if (panel._id === panel_id) {
            panel.name = panel_name;
          }
          return panel;
        });
      })

      .addCase(deletePanelAsync.pending, (state, action) => {})
      .addCase(deletePanelAsync.rejected, (state, action) => {})
      .addCase(deletePanelAsync.fulfilled, (state, action) => {
        const panel_id = action.payload;
        state.panels = state.panels.filter((panel) => panel._id !== panel_id);
      })

      .addCase(addTodoAsync.pending, (state, action) => {})
      .addCase(addTodoAsync.rejected, (state, action) => {})
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        const { addedTodo, _id } = action.payload;
        state.panels?.map((panel) => {
          if (_id === panel._id) {
            panel.todos.push(addedTodo);
          }
          return panel;
        });
      })

      .addCase(updateTodoStatusAsync.pending, (state, action) => {})
      .addCase(updateTodoStatusAsync.rejected, (state, action) => {})
      .addCase(updateTodoStatusAsync.fulfilled, (state, action) => {
        const { todoId, sourcePanelId, targetPanelId } = action.payload;

        const sourcePanel = state.panels.find(
          (panel) => panel._id === sourcePanelId
        );
        const targetPanel = state.panels.find(
          (panel) => panel._id === targetPanelId
        );

        if (!sourcePanel || !targetPanel) return;

        const todoToMove = sourcePanel.todos.find(
          (todo) => todo._id === todoId
        );
        if (!todoToMove) return;

        sourcePanel.todos = sourcePanel.todos.filter(
          (todo) => todo._id !== todoId
        );
        targetPanel.todos.push(todoToMove);
      })

      .addCase(changeTodoHeadingAsync.pending, (state, action) => {})
      .addCase(changeTodoHeadingAsync.rejected, (state, action) => {})
      .addCase(changeTodoHeadingAsync.fulfilled, (state, action) => {
        const { heading, todo_id, history } = action.payload;
        state.panels?.map((panel) => {
          panel.todos?.map((todo) => {
            if (todo._id === todo_id && history) {
              todo.heading = heading;
              todo.histories.push(history);
            }
            return todo;
          });
          return panel;
        });
      })

      .addCase(changeDescriptionAsync.pending, (state, action) => {})
      .addCase(changeDescriptionAsync.rejected, (state, action) => {})
      .addCase(changeDescriptionAsync.fulfilled, (state, action) => {
        const { description, todo_id, history } = action.payload;
        state.panels?.map((panel) => {
          panel.todos?.map((todo) => {
            if (todo._id === todo_id && history) {
              todo.description = description;
              todo.histories = history;
            }
            return todo;
          });
          return panel;
        });
      })

      .addCase(addCommentAsync.pending, (state, action) => {})
      .addCase(addCommentAsync.rejected, (state, action) => {})
      .addCase(addCommentAsync.fulfilled, (state, action) => {
        const { comment, todo_id } = action.payload;
        state.panels?.map((panel) => {
          panel.todos?.map((todo) => {
            if (todo._id === todo_id) {
              todo.comments.push(comment);
            }
            return todo;
          });
          return panel;
        });
      })

      .addCase(editCommentAsync.pending, (state, action) => {})
      .addCase(editCommentAsync.rejected, (state, action) => {})
      .addCase(editCommentAsync.fulfilled, (state, action) => {
        const { todoId, newUpdatedComment, commentId } = action.payload;
        state.panels?.map((panel) => {
          panel.todos?.map((todo) => {
            if (todo._id === todoId) {
              todo.comments?.map((comment) => {
                if (comment._id === commentId) {
                  comment.comment = newUpdatedComment;
                }
                return comment;
              });
            }
            return todo;
          });
          return panel;
        });
      })

      .addCase(deleteCommentAsync.pending, (state, action) => {})
      .addCase(deleteCommentAsync.rejected, (state, action) => {})
      .addCase(deleteCommentAsync.fulfilled, (state, action) => {
        const { todoId, commentId } = action.payload;
        state.panels?.map((panel) => {
          panel.todos?.map((todo) => {
            if (todo._id === todoId) {
              todo.comments = todo.comments.filter(
                (comment) => comment._id !== commentId
              );
            }
            return todo;
          });
          return panel;
        });
      });
  },
});

export default panelSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addNewComment,
  addNewPanel,
  addNewTodo,
  deleteExistingComment,
  dragDropTodo,
  getAllPanels,
  removePanel,
  updateComment,
  updatePanelName,
  updateTodoDescription,
  updateTodoHeading,
} from "../panel/panel.api";
import axios from "axios";
import { toast } from "react-toastify";

export interface IParams {
  search: string | null;
}

export interface IPanel {
  _id?: string;
  name: string;
  todos?: ITodos[];
}

export interface IAddPanel extends IPanel {}

export interface IEditPanel extends IPanel {
  _id: string;
}

export interface IDeletePanel {
  _id: string;
}

export interface ITodos {
  _id: string;
  heading?: string;
  description?: string;
  comments?: Comment[];
  histories?: History[];
}

export interface IAddTodo extends ITodos {
  heading: string;
}

export interface IChangeTodoHeading extends ITodos {
  heading: string;
}

export interface IChangeTodoDescription extends ITodos {
  description: string;
}

export interface IAddComment extends ITodos {
  comment: string;
}

export interface IDragDropTodos {
  todoId: string;
  sourcePanelId: string;
  targetPanelId: string;
}

export interface Comment {
  _id: string;
  date?: number;
  comment?: string;
}
export interface IEditComment extends Comment {
  todo_id: string;
  comment: string;
}

export interface IDeleteComment extends Comment {
  todo_id: string;
}

interface History {
  timestamp: string;
  field: string;
  previous: {
    heading: string;
    description: string;
  };
  updated: {
    heading: string;
    description: string;
  };
}

export interface InitialState {
  panels: IPanel[];
}

export const fetchPanels = createAsyncThunk(
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

export const addPanel = createAsyncThunk(
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

export const editPanel = createAsyncThunk(
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

export const deletePanel = createAsyncThunk(
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

export const addTodo = createAsyncThunk(
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

export const dragDropTodos = createAsyncThunk(
  "panels/dragdropTodo",
  async (payload: IDragDropTodos) => {
    try {
      const response = await dragDropTodo(payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
    }
  }
);

export const changeTodoHeading = createAsyncThunk(
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

export const changeDescription = createAsyncThunk(
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

export const addComment = createAsyncThunk(
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

export const editComment = createAsyncThunk(
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

export const deleteComment = createAsyncThunk(
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

const initialState: InitialState = {
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
      .addCase(fetchPanels.pending, (state, action) => {})
      .addCase(fetchPanels.rejected, (state, action) => {})
      .addCase(fetchPanels.fulfilled, (state, action) => {
        state.panels = action.payload;
      })

      .addCase(addPanel.pending, (state, action) => {})
      .addCase(addPanel.rejected, (state, action) => {})
      .addCase(addPanel.fulfilled, (state, action) => {
        state.panels.push({ ...action.payload });
      })

      .addCase(editPanel.pending, (state, action) => {})
      .addCase(editPanel.rejected, (state, action) => {})
      .addCase(editPanel.fulfilled, (state, action) => {
        const { panel_name, panel_id } = action.payload;
        state.panels.map((p, i) => {
          if (p._id === panel_id) {
            p.name = panel_name;
          }
          return p;
        });
      })

      .addCase(deletePanel.pending, (state, action) => {})
      .addCase(deletePanel.rejected, (state, action) => {})
      .addCase(deletePanel.fulfilled, (state, action) => {
        const panel_id = action.payload;
        state.panels = state.panels.filter((p, i) => p._id !== panel_id);
      })

      .addCase(addTodo.pending, (state, action) => {})
      .addCase(addTodo.rejected, (state, action) => {})
      .addCase(addTodo.fulfilled, (state, action) => {
        const { addedTodo, _id } = action.payload;
        console.log(_id);
        state.panels.map((p, i) => {
          if (_id === p._id) {
            p.todos.push(addedTodo);
          }
          return p;
        });
      })

      .addCase(dragDropTodos.pending, (state, action) => {})
      .addCase(dragDropTodos.rejected, (state, action) => {})
      .addCase(dragDropTodos.fulfilled, (state, action) => {
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

      .addCase(changeTodoHeading.pending, (state, action) => {})
      .addCase(changeTodoHeading.rejected, (state, action) => {})
      .addCase(changeTodoHeading.fulfilled, (state, action) => {
        const { heading, todo_id, history } = action.payload;
        state.panels.map((panel) => {
          panel.todos.map((todo) => {
            if (todo._id === todo_id) {
              if (history) {
                todo.heading = heading;
                todo.histories = history;
              } else {
                todo.heading = heading;
              }
            }
            return todo;
          });
          return panel;
        });
      })

      .addCase(changeDescription.pending, (state, action) => {})
      .addCase(changeDescription.rejected, (state, action) => {})
      .addCase(changeDescription.fulfilled, (state, action) => {
        const { description, todo_id, history } = action.payload;
        state.panels.map((panel) => {
          panel.todos.map((todo) => {
            if (todo._id === todo_id) {
              if (history) {
                todo.description = description;
                todo.histories = history;
              } else {
                todo.description = description;
              }
            }
            return todo;
          });
          return panel;
        });
      })

      .addCase(addComment.pending, (state, action) => {})
      .addCase(addComment.rejected, (state, action) => {})
      .addCase(addComment.fulfilled, (state, action) => {
        const { comment, todo_id } = action.payload;
        console.log(comment, todo_id);
        state.panels.map((panel) => {
          panel.todos.map((todo) => {
            if (todo._id === todo_id) {
              todo.comments.push(comment);
            }
            return todo;
          });
          return panel;
        });
      })

      .addCase(editComment.pending, (state, action) => {})
      .addCase(editComment.rejected, (state, action) => {})
      .addCase(editComment.fulfilled, (state, action) => {
        const { todo_id, newComment, comment_id } = action.payload;
        state.panels.map((panel) => {
          panel.todos.map((todo) => {
            if (todo._id === todo_id) {
              todo.comments.map((comment, index) => {
                if (comment._id === comment_id) {
                  comment.comment = newComment;
                }
                return comment;
              });
            }
            return todo;
          });
          return panel;
        });
      })

      .addCase(deleteComment.pending, (state, action) => {})
      .addCase(deleteComment.rejected, (state, action) => {})
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { todo_id, comment_id } = action.payload;
        state.panels.map((panel) => {
          panel.todos.map((todo) => {
            if (todo._id === todo_id) {
              todo.comments = todo.comments.filter(
                (comment) => comment._id !== comment_id
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

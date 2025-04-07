import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axios-config";

export interface IParams {
  search: string | null;
}

interface Comment {
  _id: number;
  date: number;
  comment: string;
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

export interface Todos {
  _id: number;
  heading: string;
  description: string;
  comments: Comment[];
  histories: History[];
}

export interface Panel {
  _id: number;
  name: string;
  visible: boolean;
  todos: Todos[];
}

export interface InitialState {
  panels: Panel[];
}

export const fetchPanels = createAsyncThunk(
  "panels/fetchById",
  async (params: IParams) => {
    try {
      const response = await axiosInstance.get(`/panels`, {
        params,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
);

export const addPanel = createAsyncThunk(
  "panels/addPanel",
  async (panel_name: string, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/panels`, {
        panel_name,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add penal"
      );
    }
  }
);

export const editPanel = createAsyncThunk(
  "panels/editPanel",
  async (
    {
      panel_name,
      panel_id,
    }: {
      panel_name: string;
      panel_id: number;
    },
    thunkAPI
  ) => {
    try {
      const response = await axiosInstance.put(`/panels`, {
        panel_name,
        panel_id,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch penals"
      );
    }
  }
);

export const deletePanel = createAsyncThunk(
  "panels/deletePanel",
  async (panel_id: number, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/panels/${panel_id}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch penals"
      );
    }
  }
);

export const addTodo = createAsyncThunk(
  "panels/addTodo",
  async (
    { heading, panel_id }: { heading: string; panel_id: number },
    thunkAPI
  ) => {
    try {
      const response = await axiosInstance.post(`/todos`, {
        heading,
        panel_id,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch penals"
      );
    }
  }
);

export const dragDropTodos = createAsyncThunk(
  "panels/dragdropTodo",
  async (
    {
      todoId,
      sourcePanelId,
      targetPanelId,
    }: { todoId: number; sourcePanelId: number; targetPanelId: number },
    thunkAPI
  ) => {
    try {
      const response = await axiosInstance.post(`/todos/dragdrop`, {
        todoId,
        sourcePanelId,
        targetPanelId,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch penals"
      );
    }
  }
);

export const changeHeading = createAsyncThunk(
  "panels/changeHeading",
  async ({ heading, todo_id }: { heading: string; todo_id: number }) => {
    try {
      const response = await axiosInstance.put(`/todos/heading`, {
        heading,
        todo_id,
      });
      return response.data;
    } catch (error: any) {}
  }
);

export const changeDescription = createAsyncThunk(
  "panels/changeDescription",
  async (
    {
      description,
      todo_id,
    }: {
      description: string;
      todo_id: number;
    },
    thunkAPI
  ) => {
    try {
      const response = await axiosInstance.put(`/todos/description`, {
        description,
        todo_id,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch penals"
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "panels/addComment",
  async (
    {
      comment,
      todo_id,
    }: {
      comment: string;
      todo_id: number;
    },
    thunkAPI
  ) => {
    try {
      const response = await axiosInstance.post(`/todos/comment`, {
        comment,
        todo_id,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch penals"
      );
    }
  }
);

export const editComment = createAsyncThunk(
  "panels/editComment",
  async (
    {
      todo_id,
      newComment,
      comment_id,
    }: {
      todo_id: number;
      newComment: string;
      comment_id: number;
    },
    thunkAPI
  ) => {
    try {
      const response = await axiosInstance.put(`/todos/comment`, {
        todo_id,
        newComment,
        comment_id,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch penals"
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  "panels/deleteComment",
  async (
    {
      todo_id,
      comment_id,
    }: {
      todo_id: number;
      comment_id: number;
    },
    thunkAPI
  ) => {
    try {
      const response = await axiosInstance.delete(
        `/todos/comment?todo_id=${todo_id}&comment_id=${comment_id}`
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch penals"
      );
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
    handleVisibility: (state, action) => {
      state.panels.forEach((panel) => {
        if (panel.name === action.payload) {
          panel.visible = !panel.visible;
        } else {
          panel.visible = false;
        }
      });
    },
    closeVisibility: (state, action) => {
      state.panels.forEach((panel) => {
        panel.visible = false;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPanels.fulfilled, (state, action) => {
        state.panels = action.payload;
      })
      .addCase(fetchPanels.rejected, (state, action) => {
        console.log("Error:", action.payload);
      })
      .addCase(addPanel.fulfilled, (state, action) => {
        state.panels.push({ ...action.payload, visible: false });
      })
      .addCase(addPanel.rejected, (state, action) => {
        console.log("Error:", action.payload);
      })
      .addCase(editPanel.fulfilled, (state, action) => {
        const { panel_name, panel_id } = action.payload;
        state.panels.map((p, i) => {
          if (p._id === panel_id) {
            p.name = panel_name;
          }
          return p;
        });
      })
      .addCase(editPanel.rejected, (state, action) => {
        console.log("Error:", action.payload);
      })
      .addCase(deletePanel.fulfilled, (state, action) => {
        const panel_id = action.payload;
        state.panels = state.panels.filter((p, i) => p._id !== panel_id);
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        const { addedTodo, panel_id } = action.payload;
        state.panels.map((p, i) => {
          if (panel_id === p._id) {
            p.todos.push(addedTodo);
          }
          return p;
        });
      })
      .addCase(addTodo.rejected, (state, action) => {
        console.log("Error:", action.payload);
      })
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
        ); //here based on id filtering
        targetPanel.todos.push(todoToMove);
      })
      .addCase(dragDropTodos.rejected, (state, action) => {
        console.log("Error:", action.payload);
      })
      .addCase(changeHeading.fulfilled, (state, action) => {
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
      .addCase(changeHeading.rejected, (state, action) => {
        console.log("Error:", action.payload);
      })
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
      .addCase(changeDescription.rejected, (state, action) => {
        console.log("Error:", action.payload);
      })
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
      .addCase(addComment.rejected, (state, action) => {
        console.log("Error:", action.payload);
      })
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
      .addCase(editComment.rejected, (state, action) => {
        console.log("Error:", action.payload);
      })
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
      })
      .addCase(deleteComment.rejected, (state, action) => {
        console.log("Error:", action.payload);
      });
  },
});

export default panelSlice.reducer;

export const { handleVisibility, closeVisibility } = panelSlice.actions;

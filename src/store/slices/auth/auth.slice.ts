import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { signIn, signUp } from "./auth.api";
import { toast } from "react-toastify";
import { LoginFormValues } from "../../../pages/login";
import { IRegisterFormData } from "../../../pages/Register";

export const signUpAsync = createAsyncThunk(
  "user/register",
  async (payload: IRegisterFormData) => {
    try {
      const response = await signUp(payload);
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
    }
  }
);

export const signInAsync = createAsyncThunk(
  "user/login",
  async (payload: LoginFormValues) => {
    try {
      const response = await signIn(payload);
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
    }
  }
);

const initialState = null;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    auth: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpAsync.pending, (state, action) => {})
      .addCase(signUpAsync.rejected, (state, action) => {})
      .addCase(signUpAsync.fulfilled, (state, action) => {
        toast.success(action.payload.message, {
          position: "top-right",
          autoClose: 2000,
        });
      })

      .addCase(signInAsync.pending, (state, action) => {})
      .addCase(signInAsync.rejected, (state, action) => {})
      .addCase(signInAsync.fulfilled, (state, action) => {
        toast.success(action.payload.message, {
          position: "top-right",
          autoClose: 2000,
        });
      });
  },
});

export default authSlice.reducer;

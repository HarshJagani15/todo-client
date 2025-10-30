import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProfile,
  updateProfileName,
  updateProfilePicture,
} from "./profile.api";
import axios from "axios";
import { toast } from "react-toastify";
import { IProfile_InitialState, IUpdateProfileName } from "./profile.model";

export const fetchProfileAsync = createAsyncThunk(
  "profile/fetchProfile",
  async () => {
    try {
      const response = await getProfile();
      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
    }
  }
);

export const editProfilePictureAsync = createAsyncThunk(
  "profile/editProfilePicture",
  async (payload: FormData) => {
    try {
      const response = await updateProfilePicture(payload);
      return response.data.filePath;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
    }
  }
);

export const editProfileNameAsync = createAsyncThunk(
  "profile/editProfileName",
  async (payload: IUpdateProfileName) => {
    try {
      const response = await updateProfileName(payload);
      return response.data.userName;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
      }
    }
  }
);

const initialState: IProfile_InitialState = {
  profile: { name: "", email: "", profileImage: "" },
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    profile: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileAsync.pending, (state, action) => {})
      .addCase(fetchProfileAsync.rejected, (state, action) => {})
      .addCase(fetchProfileAsync.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      .addCase(editProfilePictureAsync.pending, (state, action) => {})
      .addCase(editProfilePictureAsync.rejected, (state, action) => {})
      .addCase(editProfilePictureAsync.fulfilled, (state, action) => {
        state.profile = { ...state.profile, profileImage: action.payload };
      })

      .addCase(editProfileNameAsync.pending, (state, action) => {})
      .addCase(editProfileNameAsync.rejected, (state, action) => {})
      .addCase(editProfileNameAsync.fulfilled, (state, action) => {
        state.profile = { ...state.profile, name: action.payload };
      });
  },
});

export default profileSlice.reducer;

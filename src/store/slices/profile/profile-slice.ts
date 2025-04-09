import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProfile,
  updateProfileName,
  updateProfilePicture,
} from "../profile/profile.api";
import axios from "axios";
import { toast } from "react-toastify";

export interface IInitialState {
  profile: IProfile;
}

export interface IProfile {
  name: string;
  email?: string;
  profileImage?: string;
}

export interface IUpdateProfileName extends IProfile {}

export const fetchProfile = createAsyncThunk(
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

export const editProfilePicture = createAsyncThunk(
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

export const editProfileName = createAsyncThunk(
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

const initialState: IInitialState = {
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
      .addCase(fetchProfile.pending, (state, action) => {})
      .addCase(fetchProfile.rejected, (state, action) => {})
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      .addCase(editProfilePicture.pending, (state, action) => {})
      .addCase(editProfilePicture.rejected, (state, action) => {})
      .addCase(editProfilePicture.fulfilled, (state, action) => {
        state.profile = { ...state.profile, profileImage: action.payload };
      })

      .addCase(editProfileName.pending, (state, action) => {})
      .addCase(editProfileName.rejected, (state, action) => {})
      .addCase(editProfileName.fulfilled, (state, action) => {
        state.profile = { ...state.profile, name: action.payload };
      });
  },
});

export default profileSlice.reducer;

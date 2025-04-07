import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axios-config";

export interface Profile {
  name: string;
  email: string;
  profileImage: any;
}

interface InitialState {
  profile: Partial<Profile>;
}

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/userProfile");
      return response.data.user;
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const editProfilePicture = createAsyncThunk(
  "profile/editProfilePicture",
  async (formData: FormData) => {
    try {
      const response = await axiosInstance.post(
        "/users/userProfile/picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.filePath;
    } catch (error) {
      console.error(error);
    }
  }
);

export const editProfileName = createAsyncThunk(
  "profile/editProfileName",
  async (userName: string) => {
    try {
      const response = await axiosInstance.post("/users/userProfile/name", {
        name: userName,
      });
      return response.data.userName;
    } catch (error) {
      console.error(error);
    }
  }
);

const initialState: InitialState = {
  profile: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {})
      .addCase(editProfilePicture.fulfilled, (state, action) => {
        state.profile = { ...state.profile, profileImage: action.payload };
      })
      .addCase(editProfilePicture.rejected, (state, action) => {})
      .addCase(editProfileName.fulfilled, (state, action) => {
        state.profile = { ...state.profile, name: action.payload };
      });
  },
});

export default profileSlice.reducer;


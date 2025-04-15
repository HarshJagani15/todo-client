import { useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import panelReducer from "../slices/panel/panel.slice";
import profileReducer from "../slices/profile/profile-slice";
import authReducer from "../slices/auth/auth.slice";

export const store = configureStore({
  reducer: {
    panel: panelReducer,
    profile: profileReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

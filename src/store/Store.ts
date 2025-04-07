import { configureStore } from "@reduxjs/toolkit";
import panelReducer from "./slices/panel.slice";
import profileReducer from "./slices/profile-slice";

export const store = configureStore({
  reducer: {
    panel: panelReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const ROUTING = {
  SIGNIN: "http://localhost:3008/api/v1/users/login",
  SIGNUP: "http://localhost:3008/api/v1/users/register",
};

export const LOCALSTORAGE = {
  AUTHTOKEN: "authToken",
  REFRESHTOKEN: "refreshToken",
};

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/",
  PROFILE: "/profile",
};

export const OPTIONS = {
  LABEL: ["label 1", "label 2"],
  GROUPBY: ["value 1", "value 2"],
  DIALOG_TODO_DROPDOWN: ["To Do", "value 1"],
  DIALOG_ACTIONS: ["value 1", "value 2"],
  DIALOG_ACTIVITY: ["history", "comments"],
};

export const MESSAGE = {
  FIELD_REQUIRED: "This field is required!",
};

export const PROFILE_IMG_MESSAGE = "Image is required!";

export const REGISTER_FIELD_VALUE = [
  "userName",
  "email",
  "password",
  "confirmPassword",
];

export const LOGIN_FIELD_VALUES = ["email", "password"];

export const FILE_SIZE_MSG = "File size is too large";

export const FILE_TYPE_MSG = "Unsupported file format";

export const Invalid_EMAIL_MSG = "Invalid email";

export const PASSWORD_MSG = {
  TOSHORT: "Too short!",
  TOLONG: "Too long!",
  UPPERCASE: "Password must start with an uppercase letter",
  LOWERCASE: "Password must contain at least one lowercase letter",
  SPECIAL_CHARACTER: "Password must contain at least one special character",
  MATCH: "Passwords must match",
};

export const USERNAME_REQUIRED_MSG = "Username is required!";

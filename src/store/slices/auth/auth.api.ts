import { LoginFormValues } from "../../../pages/login";
import { IRegisterFormData } from "../../../pages/Register";
import { axiosInstance } from "../../../utils/axios-config";

export const signUp = async (payload: IRegisterFormData) => {
  try {
    const response = await axiosInstance({
      method: "POST",
      url: "/users/register",
      data: payload,
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const signIn = async (payload: LoginFormValues) => {
  try {
    const response = await axiosInstance({
      method: "POST",
      url: "/users/login",
      data: payload,
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

import { axiosInstance } from "../../utils/axios-config";
import { ILoginData, IRegisterData } from "./auth.model";

export const signUp = async (payload: IRegisterData) => {
  try {
    const response = await axiosInstance({
      method: "POST",
      url: "/auth/signup",
      data: payload,
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const signIn = async (payload: ILoginData) => {
  try {
    const response = await axiosInstance({
      method: "POST",
      url: "/auth/signin",
      data: payload,
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const github_signIn = async (code: string, LoginType: string) => {
  try {
    const response = await axiosInstance.post("/auth/signup/github", {
      code: code,
      LoginType: LoginType,
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const github_signUp = async (code: string, LoginType: string) => {
  try {
    const response = await axiosInstance.post("/auth/signup/github", {
      code: code,
      LoginType: LoginType,
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const facebook_signIn = async (
  accessToken: string,
  LoginType: string
) => {
  try {
    const response = await axiosInstance.post("/auth/signin/facebook", {
      accessToken: accessToken,
      LoginType: LoginType,
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const facebook_signUp = async (
  accessToken: string,
  LoginType: string
) => {
  try {
    const response = await axiosInstance.post("/auth/signin/facebook", {
      accessToken: accessToken,
      LoginType: LoginType,
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

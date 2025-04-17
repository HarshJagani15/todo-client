import { toast } from "react-toastify";
import { axiosInstance } from "../../config/axios-interceptor";
import {
  IFacebookSigninData,
  IFacebookSignupData,
  IGithubSigninData,
  IGithubSignupData,
  ISigninData,
  ISignupData,
} from "./auth.model";

export const signUp = async (signupData: ISignupData) => {
  try {
    const response = await axiosInstance({
      method: "POST",
      url: "/auth/signup",
      data: signupData,
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const signIn = async (signinData: ISigninData) => {
  try {
    const response = await axiosInstance({
      method: "POST",
      url: "/auth/signin",
      data: signinData,
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const github_signIn = async (githubSigninData: IGithubSigninData) => {
  try {
    const response = await axiosInstance.post(
      "/auth/signin/github",
      githubSigninData
    );
    if (response.data.success) {
      toast.success(response.data.message);
      return response;
    }
  } catch (error: unknown) {
    throw error;
  }
};

export const github_signUp = async (githubSignupData: IGithubSignupData) => {
  console.log(githubSignupData.code);
  try {
    const response = await axiosInstance.post(
      "/auth/signup/github",
      githubSignupData
    );
    if (response.data.success) {
      toast.success(response.data.message);
      return response;
    }
  } catch (error: unknown) {
    throw error;
  }
};

export const facebook_signIn = async (
  facebookSigninData: IFacebookSigninData
) => {
  try {
    const response = await axiosInstance.post(
      "/auth/signin/facebook",
      facebookSigninData
    );
    if (response.data.success) {
      toast.success(response.data.message);
      return response;
    }
  } catch (error: unknown) {
    throw error;
  }
};

export const facebook_signUp = async (
  facebookSignupData: IFacebookSignupData
) => {
  try {
    const response = await axiosInstance.post(
      "/auth/signup/facebook",
      facebookSignupData
    );
    if (response.data.success) {
      toast.success(response.data.message);
      return response;
    }
  } catch (error: unknown) {
    throw error;
  }
};

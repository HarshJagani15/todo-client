import { axiosInstance } from "../../config/axios-interceptor";
import { IUpdateProfileName } from "./profile.model";

export const getProfile = async () => {
  try {
    const response = await axiosInstance({
      method: "GET",
      url: "/user/userProfile",
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const updateProfilePicture = async (payload: FormData) => {
  try {
    const response = await axiosInstance({
      method: "POST",
      url: "/user/userProfile/picture",
      data: payload,
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const updateProfileName = async (payload: IUpdateProfileName) => {
  try {
    const response = await axiosInstance({
      method: "POST",
      url: "/user/userProfile/name",
      data: payload,
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

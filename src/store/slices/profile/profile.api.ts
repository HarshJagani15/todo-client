import { axiosInstance } from "../../../utils/axios-config";
import { IUpdateProfileName } from "./profile-slice";

export const getProfile = async () => {
  try {
    const response = await axiosInstance({
      method: "GET",
      url: "/users/userProfile",
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const updateProfilePicture = async (payload: FormData) => {
  console.log(payload);
  try {
    const response = await axiosInstance({
      method: "POST",
      url: "/users/userProfile/picture",
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
      url: "/users/userProfile/name",
      data: payload,
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

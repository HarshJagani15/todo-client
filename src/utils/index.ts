export interface ISessionData {
  accessToken: string | undefined;
}

export const getUserSessionData = () => {
  const authToken = localStorage.getItem("authToken");
  const refreshToken = localStorage.getItem("refreshToken");
  return { accessToken: authToken, refreshToken: refreshToken };
};

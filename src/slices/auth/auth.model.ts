export interface ISigninData {
  email: string;
  password: string;
}

export interface IRegisterData {
  userName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ISignupData extends IRegisterData {
  loginType: string;
}

export interface IFacebookSignupData {
  accessToken: string;
  loginType: string;
}

export interface IFacebookSigninData {
  accessToken: string;
  loginType: string;
}

export interface IGithubSigninData {
  code: string;
  loginType: string;
}

export interface IGithubSignupData {
  code: string;
  loginType: string;
}

export enum LoginType {
  FACEBOOK = "facebook",
  GOOGLE = "google",
  EMAIL = "email",
  GITHUB = "github",
}

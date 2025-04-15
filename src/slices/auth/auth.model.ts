export interface ILoginData {
  email: string;
  password: string;
}

export interface IGitHub_FailResponse {
  error: string;
  error_description?: string;
  error_uri?: string;
  status?: number;
}

export interface IRegisterData {
  userName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface IRegisterFormData extends IRegisterData {
  loginType: string;
}

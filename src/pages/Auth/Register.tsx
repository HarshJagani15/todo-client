import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Formik,
  Field,
  Form,
  FormikErrors,
  FormikValues,
  ErrorMessage,
} from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bg1 from "../../images/bg_left_auth_page.png";
import bg2 from "../../images/bg_right_auth_page.png";
import FacebookLogin, {
  SuccessResponse,
} from "@greatsumini/react-facebook-login";
import GitHubLogin from "react-github-login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGithub } from "@fortawesome/free-brands-svg-icons";
import { onSocialMediaAuthenticationFailure } from "./Login";
import {
  Invalid_EMAIL_MSG,
  LOCALSTORAGE,
  MESSAGE,
  PASSWORD_MSG,
  REGISTER_FIELD_VALUE,
  ROUTES,
} from "../../utils/constants";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "../../store";
import { signUpAsync } from "../../slices/auth/auth.slice";
import { facebook_signUp, github_signUp } from "../../slices/auth/auth.api";
import {
  IFacebookSignupData,
  IRegisterData,
  ISignupData,
  LoginType,
} from "../../slices/auth/auth.model";

export const GITHUB_APP_ID = process.env.REACT_APP_GITHUB_APP_ID!;
export const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID!;
export const GITHUB_CALLBACK_URL = process.env.REACT_APP_GITHUB_CALLBACK_URL!;

const initialSignupValues = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validationSignupSchema = Yup.object().shape({
  userName: Yup.string()
    .min(2, PASSWORD_MSG.TOSHORT)
    .max(50, PASSWORD_MSG.TOLONG)
    .required(MESSAGE.FIELD_REQUIRED),
  email: Yup.string().email(Invalid_EMAIL_MSG).required(MESSAGE.FIELD_REQUIRED),
  password: Yup.string()
    .min(6, PASSWORD_MSG.TOSHORT)
    .max(15, PASSWORD_MSG.TOLONG)
    .matches(/^[A-Z]/, PASSWORD_MSG.UPPERCASE)
    .matches(/[a-z]/, PASSWORD_MSG.LOWERCASE)
    .matches(/[^A-Za-z0-9]/, PASSWORD_MSG.SPECIAL_CHARACTER)
    .required(MESSAGE.FIELD_REQUIRED),
  confirmPassword: Yup.string()
    .min(6, "Too Short!")
    .max(15, "Too Long!")
    .required(MESSAGE.FIELD_REQUIRED)
    .oneOf([Yup.ref("password")], PASSWORD_MSG.MATCH),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const isFieldDisabled = (
    errors: FormikErrors<FormikValues>,
    values: FormikValues,
    fieldNames: string[],
    index: number
  ): boolean => {
    for (let i = 0; i < index; i++) {
      if (errors[fieldNames[i]] || !values[fieldNames[i]]) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async (values: IRegisterData) => {
    const registerFormData: ISignupData = {
      userName: values.userName,
      email: values.email,
      password: values.password,
      loginType: LoginType.EMAIL,
    };

    const response = await dispatch(signUpAsync(registerFormData));

    if (response.payload.success) {
      navigate(ROUTES.LOGIN);
    }
  };

  const onSucessFacebook = async (res: SuccessResponse) => {
    if (res && res.accessToken) {
      const facebookSignupData: IFacebookSignupData = {
        accessToken: res.accessToken,
        loginType: LoginType.FACEBOOK,
      };
      try {
        const response = await facebook_signUp(facebookSignupData);

        if (response.data.success) {
          const token = response.data.token;
          if (token) {
            localStorage.setItem(LOCALSTORAGE.AUTHTOKEN, response.data.token);
            navigate(ROUTES.DASHBOARD);
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  const onSuccessGithub = async (res: { code: string }) => {
    try {
      const githubSignupData = {
        code: res.code,
        loginType: LoginType.GITHUB,
      };
      const response = await github_signUp(githubSignupData);

      if (response.data.success) {
        const token = response.data.token;
        if (token) {
          localStorage.setItem(LOCALSTORAGE.AUTHTOKEN, response.data.token);
          navigate(ROUTES.DASHBOARD);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <React.Fragment>
      <div className="bg-gray-50 pt-4">
        <img
          src={bg1}
          alt="Backround img"
          className="absolute w-80 bottom-0 left-0"
        />
        <img
          src={bg2}
          alt="BAckground img"
          className="absolute w-96 bottom-0 right-0"
        />
        <div className="flex flex-col gap-6  justify-self-center w-fit rounded-[10px] bg-white p-10 ">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-[500] text-black ">Register</h1>
            <span>
              Already Registered?{" "}
              <Link to="/Login" className="text-blue-600">
                Sign In
              </Link>
            </span>
          </div>
          <Formik
            initialValues={initialSignupValues}
            validationSchema={validationSignupSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, values }) => (
              <Form className="flex flex-col gap-2 w-60">
                {REGISTER_FIELD_VALUE.map((name, index, fieldNames) => {
                  const isDisabled = isFieldDisabled(
                    errors,
                    values,
                    fieldNames,
                    index
                  );

                  return (
                    <div className="flex flex-col gap-[2px] relative">
                      <div className="flex flex-col gap-[1px]">
                        <label htmlFor={name} className="capitalize">{`${
                          name === "userName"
                            ? "user name"
                            : name === "confirmPassword"
                            ? "confirm password"
                            : name
                        }`}</label>
                        <Field
                          type={
                            name === "password"
                              ? showPassword
                                ? "text"
                                : "password"
                              : name === "confirmPassword"
                              ? showConfirmPassword
                                ? "text"
                                : "password"
                              : null
                          }
                          key={name}
                          name={name}
                          placeholder={`Enter your ${
                            name === "userName"
                              ? "user name"
                              : name === "confirmPassword"
                              ? "confirm password"
                              : name
                          }`}
                          disabled={isDisabled}
                          className={`${
                            isDisabled ? "bg-gray-100" : null
                          } focus:outline-none border-2 border-blue-600 rounded-[3px] px-2 py-[3px]`}
                        />
                        {!isDisabled && name === "password" && (
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-[-30px] top-[40px] -translate-y-1/2 bg-none border-none cursor-pointer transform"
                          >
                            {showPassword ? (
                              <FontAwesomeIcon icon={faEyeSlash} />
                            ) : (
                              <FontAwesomeIcon icon={faEye} />
                            )}
                          </button>
                        )}
                        {!isDisabled && name === "confirmPassword" && (
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-[-30px] top-[40px] -translate-y-1/2 bg-none border-none cursor-pointer transform"
                          >
                            {showConfirmPassword ? (
                              <FontAwesomeIcon icon={faEyeSlash} />
                            ) : (
                              <FontAwesomeIcon icon={faEye} />
                            )}
                          </button>
                        )}
                      </div>
                      <ErrorMessage
                        name={name}
                        component="div"
                        className="text-red-600 text-base leading-5 break-words"
                      />
                    </div>
                  );
                })}
                <button
                  className="bg-blue-800 text-white p-[5px] mt-5"
                  type="submit"
                >
                  Sign Up
                </button>
              </Form>
            )}
          </Formik>
          <div className="flex flex-col gap-2 self-center">
            <span className="self-center">Or Register with:</span>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="absolute top-[7px] left-8 size-5 text-white"
                />
                <FacebookLogin
                  appId={FACEBOOK_APP_ID}
                  onSuccess={onSucessFacebook}
                  onFail={onSocialMediaAuthenticationFailure}
                  autoLoad={true}
                  children="Sign up with Facebook"
                  fields="name,email,picture"
                  className="pl-12 w-60 flex items-center justify-center bg-blue-600 text-white text-base py-[5px] px-4  shadow-md hover:bg-blue-700 transition duration-300"
                />
              </div>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faGithub}
                  className="absolute top-[7px] left-8 size-5 text-white"
                />
                <GitHubLogin
                  buttonText="Sign up with Github"
                  clientId={GITHUB_APP_ID}
                  redirectUri={GITHUB_CALLBACK_URL}
                  onSuccess={onSuccessGithub}
                  onFailure={onSocialMediaAuthenticationFailure}
                  className="pl-9 w-60 bg-gray-900 text-white text-center px-4 py-[5px] rounded-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Register;

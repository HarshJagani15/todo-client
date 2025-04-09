import React from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import axios, { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bg1 from "../images/project-management.png";
import bg2 from "../images/bg_img.png";
import FacebookLogin, {
  FailResponse,
  SuccessResponse,
} from "@greatsumini/react-facebook-login";
import GitHubLogin from "react-github-login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGithub } from "@fortawesome/free-brands-svg-icons";
import { axiosInstance } from "../utils/axios-config";
import { LOCALSTORAGE, ROUTE } from "../utils/constants";
import { signInAsync } from "../store/slices/auth/auth.slice";
import { useAppDispatch } from "../store/hooks";

const GITHUB_APP_ID = process.env.REACT_APP_GITHUB_APP_ID!;
const GITHUB_CALLBACK_URL = process.env.REACT_APP_GITHUB_CALLBACK_URL!;

export enum LoginType {
  FACEBOOK = "facebook",
  GOOGLE = "google",
  EMAIL = "email",
  GITHUB = "github",
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface GitHubFailResponse {
  error: string;
  error_description?: string;
  error_uri?: string;
  status?: number;
}

const LoginSchema: Yup.ObjectSchema<LoginFormValues> = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (value: boolean) => void }
  ) => {
    try {
      const response = await dispatch(signInAsync(values));

      if (response.payload.success) {
        const token = response.payload.token;
        const refreshToken = response.payload.refreshToken;

        localStorage.setItem(LOCALSTORAGE.AUTHTOKEN, token);
        localStorage.setItem(LOCALSTORAGE.REFRESHTOKEN, refreshToken);

        setTimeout(() => navigate(ROUTE.DASHBOARD), 1000);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onSucessFacebook = async (res: SuccessResponse) => {
    if (res && res.accessToken) {
      try {
        const response: AxiosResponse = await axiosInstance.post(
          "/users/login/facebook",
          {
            accessToken: res.accessToken,
            LoginType: LoginType.FACEBOOK,
          }
        );

        if (response.data.success) {
          const token = response.data.token;
          if (token) {
            localStorage.setItem(LOCALSTORAGE.AUTHTOKEN, token);
            navigate(ROUTE.DASHBOARD);
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const onFailureFacebook = async (res: FailResponse) => {
    toast.error(res.status, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const onSuccessGithub = async (res: { code: string }) => {
    try {
      const response = await axiosInstance.post("/users/login/github", {
        code: res.code,
        LoginType: LoginType.GITHUB,
      });

      if (response.data.success) {
        const token = response.data.token;
        if (token) {
          localStorage.setItem(LOCALSTORAGE.AUTHTOKEN, token);
          navigate(ROUTE.DASHBOARD);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const onFailureGithub = (response: GitHubFailResponse) => {
    toast.error(response.status, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <React.Fragment>
      <div className="min-h-screen bg-gray-50 pt-24">
        <img
          src={bg1}
          alt="Background"
          className="absolute w-80 bottom-0 left-0"
        />
        <img
          src={bg2}
          alt="Background"
          className="absolute w-96 bottom-0 right-0"
        />
        <div className="flex flex-col items-center w-72 justify-self-center self-center bg-white shadow-lg p-6">
          <span className="mb-5 font-medium text-lg">Log in to continue</span>
          <span className="flex self-start gap-2 mb-4">
            New User?{" "}
            <Link to="/Register" className="text-blue-600">
              Register Now
            </Link>
          </span>
          <div className="flex flex-col gap-6">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="w-full flex gap-3 flex-col">
                  <div>
                    <label htmlFor="email">Email</label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="focus:border-blue-600 focus:outline-none border-2 border-blue-600 rounded-[3px] px-2 py-[3px] w-full"
                    />
                    {errors.email && touched.email && (
                      <div className="text-red-600">{errors.email}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password">Password</label>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      className="focus:border-blue-600 focus:outline-none border-2 border-blue-600 rounded-[3px] px-2 py-[3px] w-full"
                    />
                    {errors.password && touched.password && (
                      <div className="text-red-600">{errors.password}</div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-600 py-[5px] text-white rounded-sm ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "Logging in..." : "Continue"}
                  </button>
                </Form>
              )}
            </Formik>
            <div className="flex flex-col gap-3 items-center">
              <span>Or continue with:</span>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faFacebook}
                    className="absolute top-[7px] left-8 size-5 text-white"
                  />
                  <FacebookLogin
                    appId="1035125208665501"
                    onSuccess={onSucessFacebook}
                    onFail={onFailureFacebook}
                    autoLoad={true}
                    children="Login with Facebook"
                    fields="name,email,picture"
                    className="pl-9 w-60 flex items-center justify-center bg-blue-600 text-white text-base py-[5px] px-4  shadow-md hover:bg-blue-700 transition duration-300"
                  />
                </div>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faGithub}
                    className="absolute top-[7px] left-8 size-5 text-white"
                  />
                  <GitHubLogin
                    clientId={GITHUB_APP_ID}
                    redirectUri={GITHUB_CALLBACK_URL}
                    onSuccess={onSuccessGithub}
                    onFailure={onFailureGithub}
                    buttonText="Login with Github"
                    className="pl-6 w-60 bg-gray-900 text-white text-center px-4 py-[5px] rounded-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;

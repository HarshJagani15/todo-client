import React from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bg1 from "../images/project-management.png";
import bg2 from "../images/bg_img.png";
import FacebookLogin from "@greatsumini/react-facebook-login";
import GitHubLogin from "react-github-login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGithub } from "@fortawesome/free-brands-svg-icons";
import "../index.css";
import { axiosInstance } from "../utils/axios-config";

export enum LoginType {
  FACEBOOK = "facebook",
  GOOGLE = "google",
  EMAIL = "email",
  GITHUB = "github",
}

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginSchema: Yup.ObjectSchema<LoginFormValues> = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async (
    values: LoginFormValues,
    { setSubmitting }: any
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3008/api/v1/users/login",
        values
      );

      const token = response.data.token;
      const refreshToken = response.data.refreshToken;
      localStorage.setItem("authToken", token);
      localStorage.setItem("refreshToken", refreshToken);

      toast.success("Login Successful!", {
        position: "top-right",
        autoClose: 1000,
      });

      setTimeout(() => navigate("/"), 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onSucessFacebook = async (res: any) => {
    if (res && res.accessToken) {
      try {
        const response: any = await axiosInstance.post(
          "/users/login/facebook",
          {
            accessToken: res.accessToken,
            LoginType: LoginType.FACEBOOK,
          }
        );

        if (response.status === 200 || response.status === 201) {
          const token = response.data.token;
          if (token) {
            localStorage.setItem("authToken", token);
            navigate("/");
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

  const onFailureFacebook = async (res: any) => {
    toast.error("Facebook Login Failed!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const onSuccessGithub = async (res: any) => {
    try {
      const response = await axiosInstance.post("/users/login/github", {
        code: res.code,
        LoginType: LoginType.GITHUB,
      });

      if (response.status === 201 || 200) {
        const token = response.data.token;
        if (token) {
          localStorage.setItem("authToken", token);
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const onFailureGithub = (response: any) => {
    toast.error("GitHub Login Failed!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gray-50 pt-24">
        <img src={bg1} alt="" className="absolute w-80 bottom-0 left-0" />
        <img src={bg2} alt="" className="absolute w-96 bottom-0 right-0" />
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
                    clientId={process.env.REACT_APP_GITHUB_APP_ID!}
                    redirectUri={
                      process.env.REACT_APP_GITHUB_CALLBACK_URL! ||
                      "http://localhost:3000/auth/github/callback"
                    }
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
    </>
  );
};

export default Login;

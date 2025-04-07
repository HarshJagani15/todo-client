import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Field, Form, FormikErrors, FormikValues } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bg1 from "../images/project-management.png";
import bg2 from "../images/bg_img.png";
import FacebookLogin from "@greatsumini/react-facebook-login";
import GitHubLogin from "react-github-login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGithub } from "@fortawesome/free-brands-svg-icons";
import { axiosInstance } from "../utils/axios-config";
import { LoginType } from "./login";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const SignupSchema = Yup.object().shape({
    userName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/,
        "Email must end with .com"
      )
      .required("Required"),
    password: Yup.string()
      .min(6, "Too Short!")
      .max(15, "Too Long!")
      .matches(/^[A-Z]/, "Password must start with an uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      )
      .required("Required"),
    confirmPassword: Yup.string()
      .min(6, "Too Short!")
      .max(15, "Too Long!")
      .required("Required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

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

  async function handleSubmit(values: {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    try {
      const response = await axios.post(
        "http://localhost:3008/api/v1/users/register",
        {
          userName: values.userName,
          email: values.email,
          password: values.password,
          loginType: LoginType.EMAIL,
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Registration Successful!", {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/Login");
        }, 1000);
      }
    } catch (error: any) {
      if (error.response.status === 409) {
        return toast.error("User Already exists !", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      toast.error("Registration Failed!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }

  const onSucessFacebook = async (res: any) => {
    console.log(res.accessToken);
    if (res && res.accessToken) {
      try {
        const response = await axiosInstance.post("/users/register/facebook", {
          accessToken: res.accessToken,
          LoginType: LoginType.FACEBOOK,
        });

        if (response.status === 200 || response.status === 201) {
          const token = response.data.token;
          if (token) {
            localStorage.setItem("authToken", response.data.token);
            navigate("/");
          }
        }
      } catch (error) {
        console.log(error);
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
      const response = await axiosInstance.post("/users/register/github/", {
        code: res.code,
        LoginType: LoginType.GITHUB,
      });

      if (response.status === 200 || response.status === 201) {
        const token = response.data.token;
        if (token) {
          localStorage.setItem("authToken", response.data.token);
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
      <div className="bg-gray-50 pt-4">
        <img src={bg1} alt="" className="absolute w-72 bottom-0 left-0" />
        <img src={bg2} alt="" className="absolute w-96 bottom-0 right-0" />
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
            initialValues={{
              userName: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values }) => (
              <Form className="flex flex-col gap-2 w-60">
                {["userName", "email", "password", "confirmPassword"].map(
                  (name, index, fieldNames) => {
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
                            className="focus:outline-none border-2 border-blue-600 rounded-[3px] px-2 py-[3px]"
                          />
                          {!isDisabled && name === "password" && (
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              style={{
                                position: "absolute",
                                right: "-30px",
                                top: "40px",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              {showPassword ? "🙈" : "👁️"}
                            </button>
                          )}
                          {!isDisabled && name === "confirmPassword" && (
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              style={{
                                position: "absolute",
                                right: "-30px",
                                top: "40px",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              {showConfirmPassword ? "🙈" : "👁️"}
                            </button>
                          )}
                        </div>
                        {errors[name as keyof typeof errors] &&
                          touched[name as keyof typeof touched] && (
                            <div className="text-red-600 text-base leading-5 break-words">
                              {errors[name as keyof typeof errors]}!
                            </div>
                          )}
                      </div>
                    );
                  }
                )}
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
                  appId="1035125208665501"
                  onSuccess={onSucessFacebook}
                  onFail={onFailureFacebook}
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
                  clientId={process.env.REACT_APP_GITHUB_APP_ID!}
                  redirectUri={
                    process.env.REACT_APP_GITHUB_CALLBACK_URL! ||
                    "http://localhost:3000/auth/github/callback"
                  }
                  onSuccess={onSuccessGithub}
                  onFailure={onFailureGithub}
                  className="pl-9 w-60 bg-gray-900 text-white text-center px-4 py-[5px] rounded-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;

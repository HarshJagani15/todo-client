import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Field, Form, FormikErrors, FormikValues } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
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
import { GitHubFailResponse, LoginType } from "./login";
import { LOCALSTORAGE, ROUTE } from "../utils/constants";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "../store/hooks";
import { signUpAsync } from "../store/slices/auth/auth.slice";

const GITHUB_APP_ID = process.env.REACT_APP_GITHUB_APP_ID!;
const GITHUB_CALLBACK_URL = process.env.REACT_APP_GITHUB_CALLBACK_URL!;

export interface IRegisterFormValues {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IRegisterFormData
  extends Omit<IRegisterFormValues, "confirmPassword"> {
  loginType: string;
}

const SignupSchema = Yup.object().shape({
  userName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
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

  const handleSubmit = async (values: IRegisterFormValues) => {
    const payload: IRegisterFormData = {
      userName: values.userName,
      email: values.email,
      password: values.password,
      loginType: LoginType.EMAIL,
    };

    const response = await dispatch(signUpAsync(payload));

    if (response.payload.success) {
      setTimeout(() => {
        navigate(ROUTE.LOGIN);
      }, 1000);
    }
  };

  const onSucessFacebook = async (res: SuccessResponse) => {
    if (res && res.accessToken) {
      try {
        const response = await axiosInstance.post("/users/register/facebook", {
          accessToken: res.accessToken,
          LoginType: LoginType.FACEBOOK,
        });

        if (response.data.success) {
          const token = response.data.token;
          if (token) {
            localStorage.setItem(LOCALSTORAGE.AUTHTOKEN, response.data.token);
            navigate(ROUTE.DASHBOARD);
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

  const onFailureFacebook = async (res: FailResponse) => {
    toast.error(res.status, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const onSuccessGithub = async (res: { code: string }) => {
    try {
      const response = await axiosInstance.post("/users/register/github/", {
        code: res.code,
        LoginType: LoginType.GITHUB,
      });

      if (response.data.success) {
        const token = response.data.token;
        if (token) {
          localStorage.setItem(LOCALSTORAGE.AUTHTOKEN, response.data.token);
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
  const onFailureGithub = (res: GitHubFailResponse) => {
    toast.error(res.status, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <React.Fragment>
      <div className="bg-gray-50 pt-4">
        <img
          src={bg1}
          alt="Backround img"
          className="absolute w-72 bottom-0 left-0"
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
                              {showConfirmPassword ? (
                                <FontAwesomeIcon icon={faEyeSlash} />
                              ) : (
                                <FontAwesomeIcon icon={faEye} />
                              )}
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
                  clientId={GITHUB_APP_ID}
                  redirectUri={GITHUB_CALLBACK_URL}
                  onSuccess={onSuccessGithub}
                  onFailure={onFailureGithub}
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

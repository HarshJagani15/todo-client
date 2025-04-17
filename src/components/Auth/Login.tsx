import React from "react";
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  FormikErrors,
  FormikValues,
} from "formik";
import * as Yup from "yup";
import { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bg1 from "../../images/auth-left-img.png";
import bg2 from "../../images/auth-right-img.png";
import FacebookLogin, {
  SuccessResponse,
} from "@greatsumini/react-facebook-login";
import GitHubLogin from "react-github-login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  Invalid_EMAIL_MSG,
  LOCALSTORAGE,
  LOGIN_FIELD_VALUES,
  MESSAGE,
  ROUTES,
} from "../../utils/constants";
import { signInAsync } from "../../slices/auth/auth.slice";
import { useAppDispatch } from "../../store";
import { facebook_signIn, github_signIn } from "../../slices/auth/auth.api";
import {
  IFacebookSigninData,
  IGithubSigninData,
  ISigninData,
  LoginType,
} from "../../slices/auth/auth.model";
import {
  FACEBOOK_APP_ID,
  GITHUB_APP_ID,
  GITHUB_CALLBACK_URL,
} from "./Register";

export const onSocialMediaAuthenticationFailure = (res: any) => {
  if (res.status) {
    toast.error(res.status);
  } else {
    toast.error(res.message);
  }
};

const initialSigninValues = { email: "", password: "" };

const validationSigninSchema = Yup.object().shape({
  email: Yup.string().email(Invalid_EMAIL_MSG).required(MESSAGE.FIELD_REQUIRED),
  password: Yup.string().required(MESSAGE.FIELD_REQUIRED),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

  const handleLogin = async (
    values: ISigninData,
    { setSubmitting }: { setSubmitting: (value: boolean) => void }
  ) => {
    const response = await dispatch(signInAsync(values));

    if (response.payload.success) {
      const token = response.payload.token;
      const refreshToken = response.payload.refreshToken;

      localStorage.setItem(LOCALSTORAGE.AUTHTOKEN, token);
      localStorage.setItem(LOCALSTORAGE.REFRESHTOKEN, refreshToken);

      navigate(ROUTES.DASHBOARD);
    }
    setSubmitting(false);
  };

  const onSucessFacebook = async (res: SuccessResponse) => {
    if (res && res.accessToken) {
      const facebookSigninData: IFacebookSigninData = {
        accessToken: res.accessToken,
        loginType: LoginType.FACEBOOK,
      };
      try {
        const response: AxiosResponse = await facebook_signIn(
          facebookSigninData
        );

        if (response.data.success) {
          const token = response.data.token;
          if (token) {
            localStorage.setItem(LOCALSTORAGE.AUTHTOKEN, token);
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
      const githubSigninData: IGithubSigninData = {
        code: res.code,
        loginType: LoginType.GITHUB,
      };
      const response = await github_signIn(githubSigninData);

      if (response.data.success) {
        const token = response.data.token;
        if (token) {
          localStorage.setItem(LOCALSTORAGE.AUTHTOKEN, token);
          navigate(ROUTES.DASHBOARD);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
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
              initialValues={initialSigninValues}
              validationSchema={validationSigninSchema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting, errors, values }) => (
                <Form className="w-full flex gap-3 flex-col">
                  {LOGIN_FIELD_VALUES.map((name, index, fieldNames) => {
                    const isDisabled = isFieldDisabled(
                      errors,
                      values,
                      fieldNames,
                      index
                    );
                    return (
                      <div>
                        <label htmlFor="email" className="capitalize">
                          {name}
                        </label>
                        <Field
                          type={name === "email" ? "email" : "password"}
                          key={name}
                          name={name}
                          disabled={isDisabled}
                          placeholder={`Enter your ${name}`}
                          className={`${
                            isDisabled ? "bg-gray-100" : null
                          } focus:border-blue-600 focus:outline-none border-2 border-blue-600 rounded-[3px] px-2 py-[3px] w-full`}
                        />
                        <ErrorMessage
                          name={name}
                          component="div"
                          className="text-red-600"
                        />
                      </div>
                    );
                  })}
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
                    appId={FACEBOOK_APP_ID}
                    onSuccess={onSucessFacebook}
                    onFail={onSocialMediaAuthenticationFailure}
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
                    onFailure={onSocialMediaAuthenticationFailure}
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

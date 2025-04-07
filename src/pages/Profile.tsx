import { faUser, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { getImagePath } from "../utils/get-Image";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  editProfileName,
  editProfilePicture,
} from "../store/slices/profile-slice";

const Profile = () => {
  const ProfileImage = Yup.object().shape({
    image: Yup.mixed()
      .required("Image is required")
      .test(
        "fileSize",
        "File size is too large",
        (value: any) => value && value?.size <= 5000000
      ) // 5MB max
      .test(
        "fileType",
        "Unsupported file format",
        (value: any) =>
          value && ["image/jpeg", "image/png"].includes(value?.type)
      ),
  });
  // const [profileUser, setProfileUser] = useState<any>();
  const [featureImage, setFeatureImage] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isUserNameEditing, setIsUserNameEditing] = useState(false);
  const [userName, setUserName] = useState("");
  const [isUserNameEmpty, setIsUserNameEmpty] = useState("");
  const { profile } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();

  const imagePath = useMemo(
    () => getImagePath(profile?.profileImage),
    [profile?.profileImage]
  );

  const handleEditUserName = async () => {
    dispatch(editProfileName(userName));
    setIsUserNameEditing(false);
    setIsUserNameEmpty(null);
  };

  const handleFileChange = (e: any, setFieldValue: any) => {
    const file = e.target.files[0];
    if (file) {
      setFeatureImage(false);
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      setFieldValue("image", file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const addProfilePicture = async (values: { image: any }) => {
    const formData = new FormData();
    formData.append("image", values.image);
    dispatch(editProfilePicture(formData));

    setOpenDialog(false);
  };

  useEffect(() => {
    setUserName(profile?.name);
  }, [profile?.name]);
  return (
    <div className="flex flex-col w-[800px] justify-self-center">
      <div className="bg-gray-200 h-32"></div>
      <div className="flex justify-between">
        <div className="mt-[-60px] ml-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            {/* {profileUser?.profileImage ? ( */}
            <img
              onClick={() => setOpenDialog(true)}
              src={imagePath}
              alt=""
              className="rounded-full h-24 w-24 bg-slate-400 border-[2px] border-white flex justify-center items-center"
            />

            {openDialog ? (
              <div
                className="fixed inset-0 flex
                         justify-center
                        bg-black bg-opacity-50"
              >
                <div className="absolute top-16 w-60 h-60 bg-white flex flex-col items-center justify-between p-4">
                  <Formik
                    initialValues={{
                      image: null,
                    }}
                    validationSchema={ProfileImage}
                    onSubmit={addProfilePicture}
                  >
                    {({ setFieldValue, errors, touched }) => (
                      <Form className="h-full flex flex-col justify-between">
                        <div className="flex flex-col justify-center items-center gap-2">
                          <div className=" rounded-full h-24 w-24 bg-slate-400 border-[2px] border-white flex justify-center items-center ">
                            {featureImage ? (
                              <label
                                htmlFor="image"
                                className=" rounded-full h-24 w-24 bg-slate-400 border-[2px] border-white flex justify-center items-center"
                              >
                                <img
                                  src={imagePath}
                                  alt=""
                                  className="h-24 w-24 object-cover rounded-full"
                                />
                              </label>
                            ) : (
                              <img
                                className="h-24 w-24 object-cover rounded-full"
                                src={imageUrl}
                                alt=""
                              />
                            )}
                          </div>
                          {errors.image && touched.image && (
                            <div className="text-black text-base text-wrap">
                              {errors.image as string}
                            </div>
                          )}
                          <input
                            id="image"
                            name="image"
                            type="file"
                            onChange={(e) => {
                              handleFileChange(e, setFieldValue);
                            }}
                            style={{ display: "none" }}
                          />
                          <label
                            htmlFor="image"
                            className="border-gray-300 border-[1px] px-2"
                          >
                            Upload Image
                          </label>
                        </div>
                        <div className="flex gap-2 self-end">
                          <button
                            className="bg-yellow-300 px-4"
                            onClick={() => {
                              setOpenDialog(false);
                              setFeatureImage(true);
                            }}
                          >
                            Cancel
                          </button>
                          <button type="submit" className="bg-blue-600 px-4">
                            Save
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            ) : null}
            <h1 className="text-2xl font-semibold capitalize">
              {profile?.name}
            </h1>
            <button className="text-sm border-[1px] border-gray-300 w-60 py-[2px] font-medium mt-4">
              Manage your account
            </button>
          </div>
          <div className="border-gray-200 border-[1px] p-4 flex flex-col gap-6 text-sm">
            <div className="flex flex-col gap-6">
              <h3 className="font-medium">About</h3>
              <div className="flex flex-col gap-1">
                <div
                  className="flex gap-4 w-fit items-center cursor-pointer"
                  onClick={() => setIsUserNameEditing(true)}
                >
                  <FontAwesomeIcon icon={faUser} />
                  {isUserNameEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="focus:outline-none border-[1px] border-black"
                    />
                  ) : (
                    <span className="leading-none">{profile?.name}</span>
                  )}
                </div>
                <span className="pl-7">
                  {isUserNameEmpty !== "" ? isUserNameEmpty : null}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <h3 className="font-medium">Contact</h3>
              <div className="flex gap-4 w-fit">
                <FontAwesomeIcon icon={faEnvelope} />
                <span className="leading-none">{profile?.email}</span>
              </div>
            </div>
            {isUserNameEditing ? (
              <button
                type="button"
                onClick={() => {
                  if (userName === "") {
                    setIsUserNameEmpty("Required!");
                  } else {
                    handleEditUserName();
                  }
                }}
                className="bg-blue-700 px-3 text-white w-fit self-end"
              >
                Save
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-10 mt-6">
          <div>
            <h2 className="font-medium">Worked On</h2>
            <span className="text-sm">
              Others will only see what they can access.
            </span>
          </div>

          <div>
            <h1 className="font-medium text-lg">
              There is no work to see here
            </h1>
            <span className="text-base">
              Things you created edited or commented on in the last 90 days.
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-medium">Places you work in</h3>
            <div>
              <h1 className="font-medium text-lg">
                We don't have places to show here yet
              </h1>
              <span className="text-base">
                there is no projects or spaces you've worked in across the last
                90 days.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

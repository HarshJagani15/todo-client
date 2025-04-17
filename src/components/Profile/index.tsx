import { faUser, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getImagePath } from "../../utils/image";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  editProfileName,
  editProfilePicture,
} from "../../slices/profile/profile.slice";
import {
  FILE_SIZE_MSG,
  FILE_TYPE_MSG,
  PROFILE_IMG_MESSAGE,
  USERNAME_REQUIRED_MSG,
} from "../../utils/constants";

const initialProfileValue = {
  image: null,
};

const validationProfileImageSchema = Yup.object().shape({
  image: Yup.mixed()
    .required(PROFILE_IMG_MESSAGE)
    .test(
      "fileSize",
      FILE_SIZE_MSG,
      (value: File | undefined) => value && value?.size <= 2000000
    )
    .test(
      "fileType",
      FILE_TYPE_MSG,
      (value: File | undefined) =>
        value && ["image/jpeg", "image/png"].includes(value?.type)
    ),
});

const Profile = () => {
  const { profile } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();

  const [featureImage, setFeatureImage] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isUserNameEditing, setIsUserNameEditing] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [isUserNameEmpty, setIsUserNameEmpty] = useState<string>("");

  useEffect(() => {
    setUserName(profile?.name);
  }, [profile?.name]);

  const imagePath = useMemo(
    () => getImagePath(profile?.profileImage),
    [profile?.profileImage]
  );

  const handleEditUserName = async () => {
    dispatch(editProfileName({ name: userName }));
    setIsUserNameEditing(false);
    setIsUserNameEmpty("");
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (
      field: string,
      value: File,
      shouldValidate?: boolean
    ) => void
  ) => {
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

  const addProfilePicture = async (values: { image: File }) => {
    const formData = new FormData();
    formData.append("image", values.image);
    dispatch(editProfilePicture(formData));

    setOpenDialog(false);
  };

  return (
    <div className="flex flex-col w-[800px] justify-self-center">
      <div className="bg-gray-200 h-32"></div>
      <div className="flex justify-between">
        <div className="mt-[-60px] ml-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <img
              onClick={() => setOpenDialog(true)}
              src={imagePath}
              alt="profileImg"
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
                    initialValues={initialProfileValue}
                    validationSchema={validationProfileImageSchema}
                    onSubmit={addProfilePicture}
                  >
                    {({ setFieldValue }) => (
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
                                  alt="Profile"
                                  className="h-24 w-24 object-cover rounded-full"
                                />
                              </label>
                            ) : (
                              <img
                                className="h-24 w-24 object-cover rounded-full"
                                src={imageUrl}
                                alt="img"
                              />
                            )}
                          </div>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            onChange={(e) => {
                              handleFileChange(e, setFieldValue);
                            }}
                            className="file-input-hidden"
                          />
                          <label
                            htmlFor="image"
                            className="border-gray-300 border-[1px] px-2"
                          >
                            Upload Image
                          </label>
                          <ErrorMessage
                            name="image"
                            component="div"
                            className="text-red-600 text-base text-wrap"
                          />
                        </div>
                        <div className="flex gap-2 self-center">
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
                <span className="pl-7 text-red-600">
                  {isUserNameEmpty.length ? isUserNameEmpty : null}
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
                  if (!userName.length) {
                    setIsUserNameEmpty(USERNAME_REQUIRED_MSG);
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

import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getImagePath } from "../utils/get-Image";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProfile } from "../store/slices/profile-slice";

const Header = () => {
  const { profile } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();
  // console.log(profile.profileImage);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const navigate = useNavigate();
  return (
    <div className="flex justify-between px-6 py-2">
      <div className="flex gap-8 items-center">
        <img
          src="https://1000logos.net/wp-content/uploads/2021/05/Atlassian-Logo-2010s1.png"
          alt=""
          className="w-16"
        />
        <ul className="flex gap-4">
          <select name="Your work" id="" className="focus:outline-none">
            <option value="" disabled selected hidden>
              Your work
            </option>
            <option value="Option 1">Today</option>
          </select>
          <select name="Dashboards" id="" className="focus:outline-none">
            <option value="" disabled selected hidden>
              Dashboards
            </option>
            <option value="Option 1">Option 1</option>
          </select>
        </ul>
      </div>
      <div className="flex items-center gap-4">
        <FontAwesomeIcon icon={faBell} />
        <img
          src={getImagePath(profile?.profileImage)}
          alt=""
          className="size-7 rounded-full"
          onClick={() => navigate("Profile")}
        />
      </div>
    </div>
  );
};

export default Header;

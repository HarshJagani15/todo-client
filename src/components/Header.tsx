import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchProfile } from "../slices/profile/profile.slice";
import { ROUTES } from "../utils/constants";
import site_logo from "../images/site-logo.png";
import { getImagePath } from "../utils/image";

const Header = () => {
  const navigate = useNavigate();
  const { profile } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <div className="flex justify-between px-10 py-2 pt-4">
      <div className="flex gap-8 items-center">
        <img src={site_logo} alt="Logo" className="w-20" />
      </div>
      <div className="flex items-center gap-4">
        <FontAwesomeIcon icon={faBell} />
        <img
          src={getImagePath(profile?.profileImage)}
          alt="Profile-Image"
          className="size-7 rounded-full"
          onClick={() => navigate(ROUTES.PROFILE)}
        />
      </div>
    </div>
  );
};

export default Header;

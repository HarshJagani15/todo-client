import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getImagePath } from "../utils/get-Image";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProfile } from "../store/slices/profile/profile-slice";
import { ROUTE, ROUTING } from "../utils/constants";
import Select from "./common/Select";

const Header = () => {
  const navigate = useNavigate();
  const { profile } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <div className="flex justify-between px-6 py-2">
      <div className="flex gap-8 items-center">
        <img src={ROUTING.SITELOGO} alt="Logo" className="w-16" />
        <ul className="flex gap-4">
          <Select
            name={"Your Work"}
            defaultOption={"Your work"}
            options={["Today", "Tommorow"]}
          />
          <Select
            name={"Dashboards"}
            defaultOption={"Dashboards"}
            options={["Option 1", "Option 2"]}
          />
        </ul>
      </div>
      <div className="flex items-center gap-4">
        <FontAwesomeIcon icon={faBell} />
        <img
          src={getImagePath(profile?.profileImage)}
          alt="Profile-Image"
          className="size-7 rounded-full"
          onClick={() => navigate(ROUTE.PROFILE)}
        />
      </div>
    </div>
  );
};

export default Header;

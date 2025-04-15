import default_Image from "../images/default_image.png";

export const defaultImage = () => default_Image;

export const getImagePath = (img: string) => {
  if (!img?.startsWith("https://")) {
    const baseURL = process.env.REACT_APP_API_BASE_URL!;
    if (img) {
      return `${baseURL}${img}`;
    } else {
      return defaultImage();
    }
  }
  return img;
};

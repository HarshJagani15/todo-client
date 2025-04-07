import men from "../images/men.png";

export const getImagePath = (img: string) => {
  if (!img?.startsWith("https://")) {
    const baseURL = process.env.REACT_APP_API_BASE_URL!;
    if (img) {
      return baseURL + img;
    } else {
      return men;
    }
  } else {
    return img;
  }
};

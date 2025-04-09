export const defaultImage = (imagePath: string) => `../images/${imagePath}`;

export const profileDefultImage = "default_image.png";

export const getImagePath = (img: string) => {
  if (!img?.startsWith("https://")) {
    const baseURL = process.env.REACT_APP_API_BASE_URL!;
    if (img) {
      return `${baseURL}${img}`;
    } else {
      return defaultImage(profileDefultImage);
    }
  }
  return img;
};

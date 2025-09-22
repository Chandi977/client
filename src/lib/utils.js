export const secureUrl = (url) => {
  if (typeof url === "string" && url.startsWith("http://res.cloudinary.com")) {
    return url
      .replace("http://", "https://")
      .replace("/upload/", "/upload/f_auto,q_auto/");
  }
  return url;
};

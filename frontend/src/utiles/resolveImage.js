export const resolveImage = (img) =>
  typeof img === "string" && !img.startsWith("http")
    ? `http://localhost:4000/images/${img}`
    : img;

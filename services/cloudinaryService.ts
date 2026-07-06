export const uploadImage = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "civic_upload");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/ordpnpis/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  const data = await res.json();

  return {
    url: data.secure_url,
  };
};
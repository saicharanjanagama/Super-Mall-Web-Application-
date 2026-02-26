export async function uploadToCloudinary(file, options = {}) {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.REACT_APP_CLOUDINARY_PRESET;

  if (!cloudName || !preset) {
    throw new Error("Cloudinary configuration missing");
  }

  if (!file) {
    throw new Error("No file provided");
  }

  /* =========================
     FILE VALIDATION
  ========================= */

  const maxSizeMB = options.maxSizeMB ?? 5;
  const allowedTypes = options.allowedTypes ?? [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Unsupported file type");
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`File exceeds ${maxSizeMB}MB`);
  }

  /* =========================
     UPLOAD
  ========================= */

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  if (options.folder) {
    formData.append("folder", options.folder);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error("Upload failed. Please try again.");
    }

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error(data.error?.message || "Upload error");
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
    };
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Upload timeout. Try again.");
    }

    throw new Error(err.message || "Upload failed");
  }
}
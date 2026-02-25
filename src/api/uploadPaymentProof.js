// src/api/uploadPaymentProof.js

export async function uploadPaymentProofToCloudinary(file) {
  try {
    const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const PRESET = process.env.REACT_APP_CLOUDINARY_PRESET;

    if (!CLOUD_NAME || !PRESET) {
      throw new Error("Cloudinary configuration missing");
    }

    if (!file) {
      throw new Error("No file selected");
    }

    /* ==============================
       FILE VALIDATION
    ============================== */

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    const maxSizeMB = 5;

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG or WEBP images allowed");
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`File must be under ${maxSizeMB}MB`);
    }

    /* ==============================
       PREPARE UPLOAD
    ============================== */

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", PRESET);
    formData.append("folder", "payment_proofs");

    /* ==============================
       FETCH WITH TIMEOUT
    ============================== */

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20 sec

    const res = await fetch(url, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Cloudinary error:", errorData);
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const data = await res.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
    };

  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Upload timeout. Try again.");
    }

    throw new Error(error.message || "Payment proof upload failed");
  }
}
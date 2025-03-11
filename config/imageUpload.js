import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const imageUpload = async (image, folderName, id) => {
  try {
    const uploadedImage = await cloudinary.uploader.upload(image, {
      resource_type: "image",
      folder: folderName,
    });
    fs.unlinkSync(image);
    return {
      user_id: id,
      image_id: uploadedImage.asset_id,
      image_url: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
      active: true
    };
  } catch (error) {
    fs.unlinkSync(image);
    return false;
  }
};

export const uploadMultipleImages = async (images, folderName, id) => {
  let uploadedImages = [];

  for (const file of images) {
    try {
      let imageInfo = await imageUpload(file.path, folderName, id);
      uploadedImages.push(imageInfo);
    } catch (error) {
      return false;
    }
  }

  return uploadedImages;
};

export const deleteImageFromCloudinary = async (image_id) => {
  const result = await cloudinary.uploader.destroy(image_id);
  return result;
};

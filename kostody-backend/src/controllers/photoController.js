import cloudinary from "../config/cloudinary.js";
import { prisma } from "../config/db.js";
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadJobPhotos = async (req, res) => {
  try {
    const { jobId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: `kostody/${jobId}` },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          },
        );
        uploadStream.end(file.buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);

    const photoRecords = await Promise.all(
      urls.map((url) =>
        prisma.photo.create({
          data: { jobId, url },
        }),
      ),
    );

    res.status(201).json(photoRecords);
  } catch (error) {
    console.error("Error uploading photos:", error);
    res.status(500).json({ message: "Server Error: Could not upload photos" });
  }
};

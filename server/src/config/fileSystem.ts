import multer from 'multer';
import { randomUUIDv7 } from "bun";

import fs from 'fs';
import path from 'path';
export const mimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"]

const uploadDir = './public/images';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split('.').pop();
    cb(null, randomUUIDv7() + '.' + extension)
  }
})

export const deleteFile = (filename: string) => {
  const filePath = path.join(`${process.cwd()}/public/images`, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

export const upload = multer({
  storage: storage,
});
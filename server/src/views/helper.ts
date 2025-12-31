import ejs from "ejs";
import { ZodError } from "zod";
import path from "path";
import moment from "moment";
import { mimeTypes } from "../config/fileSystem";
export const formatError = (error: ZodError): any => {
  let errors: any = {};
  error.issues?.forEach((issue) => {
    const key = issue.path[0] || "";
    errors[key] = issue.message;
  });
  return errors;
};

export const renderEmail = async (filename: string, payload: any): Promise<string> => {
  const html: string = await ejs.renderFile(path.join(import.meta.dir, `emails/${filename}.ejs`), payload);
  return html;
};

export const getDateDiff = (date: Date | string): number => {
  const now = moment();
  const tokenSendAt = moment(date);
  const diff = moment.duration(now.diff(tokenSendAt));
  return diff.asHours();
};

export const imageValidator = (image: string): boolean | null => {
  const imageRegex = /\.(jpg|jpeg|png|gif|webp)$/i;
  return imageRegex.test(image);
};

export const fileValidator = (file: File): string | null => {
  if (!file) return "File is required";

  if (bytesToMB(file.size) > 2) return "File size should be less than 2MB";

  if (!mimeTypes.includes(file.type)) return "File should be an png, jpg, jpeg, gif, webp";
  return null;
};

export const bytesToMB = (bytes: number): number => {
  return bytes / (1024 * 1024);
};

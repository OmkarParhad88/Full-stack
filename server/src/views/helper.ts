import ejs from "ejs";
import { ZodError } from "zod";
import path from "path";
import moment from "moment";

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


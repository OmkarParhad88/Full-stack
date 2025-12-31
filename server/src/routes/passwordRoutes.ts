import { Router, type Request, type Response } from "express";
import prisma from "../config/database";
import { randomUUIDv7 } from "bun";
import { formatError, getDateDiff, renderEmail } from "../views/helper";
import { emailQueue, emailQueueName } from "../jobs/EmailJob";
import { AuthRateLimitter } from "../config/rate-limit";
import { forgotPasswordSchema, resetPasswordSchema } from "../validator/passwordValidator";
import { type ZodError } from "zod";

const router = Router();

router.post("/forget-password", AuthRateLimitter, async (req: Request, res: Response) => {
  try {
    const payload = forgotPasswordSchema.safeParse(req.body);
    if (!payload.success) {
      const error = payload.error as ZodError;
      return res.status(422).json({ status: 422, message: "Validation Error", errors: formatError(error) });
    }
    const user = await prisma.user.findUnique({ where: { email: payload.data.email } });
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found", errors: { email: "Email not found" } });
    }
    const token = randomUUIDv7();
    const hashedToken = await Bun.password.hash(token, {
      algorithm: "bcrypt",
    });
    const url = `${Bun.env.TEND_URL}/reset-password?email=${payload.data.email}&token=${token}`;

    const html = await renderEmail("forget-password", { link: url });
    await emailQueue.add(emailQueueName, { to: payload.data.email, subject: "Reset Password", html });

    await prisma.user.update({
      data: {
        password_reset_token: hashedToken,
        token_send_at: new Date().toISOString(),
      },
      where: { email: payload.data.email },
    });
    return res.status(200).json({ status: 200, message: "Reset password link please check your email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal Server Error", errors: { email: "Internal Server Error" } });
  }
});

router.post("/reset-password", AuthRateLimitter, async (req: Request, res: Response) => {
  try {
    const payload = resetPasswordSchema.safeParse(req.body);
    if (!payload.success) {
      const error = payload.error as ZodError;
      return res.status(422).json({ status: 422, message: "Validation Error", errors: formatError(error) });
    }
    const user = await prisma.user.findUnique({ where: { email: payload.data.email } });
    if (!user || user.password_reset_token === null) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    const hoursDiff = getDateDiff(user.token_send_at!);
    if (hoursDiff > 3) {
      return res.status(410).json({ status: 410, message: "Token expired", error: "Token expired please request again" });
    }

    const isVerified = await Bun.password.verify(payload.data.token as string, user.password_reset_token);

    if (!isVerified) {
      return res.status(401).json({ status: 401, message: "Invalid token", error: "Invalid token please request again" });
    }

    const hashedPassword = await Bun.password.hash(payload.data.password, {
      algorithm: "bcrypt",
    });

    await prisma.user.update({
      data: {
        password: hashedPassword,
        password_reset_token: null,
        token_send_at: null,
      },
      where: { email: payload.data.email },
    });
    return res.status(200).json({ status: 200, message: "Password reset successfully please login again" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error });
  }
});

export default router;



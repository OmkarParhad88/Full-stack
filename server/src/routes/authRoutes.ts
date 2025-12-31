import { Router, type Request, type Response } from "express";
import { loginSchema, registerSchema } from "../validator/authValidator";
const router = Router();
import { ZodError } from "zod";
import { formatError, renderEmail } from "../views/helper";
import prisma from "../config/database";
import { randomUUIDv7 } from "bun";
import jwt from "jsonwebtoken";
import { emailQueue, emailQueueName } from "../jobs/EmailJob";
import AuthMiddleware from "../middleware/AuthMiddleware";
import { AuthRateLimitter } from "../config/rate-limit";

router.post("/register", AuthRateLimitter, async (req: Request, res: Response) => {
  try {
    const payload = registerSchema.safeParse(req.body);
    if (!payload.success) {
      const error = payload.error as ZodError;
      res.status(422).json({ status: 422, message: "Validation Error", errors: formatError(error) });
    } else {
      let user = await prisma.user.findUnique({ where: { email: payload.data.email } });
      if (user) {
        res.status(400).json({ status: 400, message: "Email already exists" });
      }

      const token = randomUUIDv7();
      const hashedToken = await Bun.password.hash(token, {
        algorithm: "bcrypt",
      });

      const url = `${Bun.env._URL}/api/auth/verify/verify-email?email=${payload.data.email}&token=${token}`;

      const html = await renderEmail("email-varify", { name: payload.data.name, link: url });
      await emailQueue.add(emailQueueName, { to: payload.data.email, subject: "Verify Email", html });
      const saltRounds = 10;
      let newUser = await prisma.user.create({
        data: {
          name: payload.data.name,
          email: payload.data.email,
          password: await Bun.password.hash(payload.data.password, {
            algorithm: "bcrypt",
          }),
          email_verify_token: hashedToken,
        }
      });
      res.status(200).json({ status: 200, message: "Email sent successfully", data: newUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error });
  }
});

router.post("/login", AuthRateLimitter, async (req: Request, res: Response) => {
  try {
    const payload = loginSchema.safeParse(req.body);
    if (!payload.success) {
      const error = payload.error as ZodError;
      return res.status(422).json({ status: 422, message: "Validation Error", errors: formatError(error) });
    }

    let user = await prisma.user.findUnique({ where: { email: payload.data.email } });
    if (!user || user === null) {
      return res.status(404).json({ status: 404, message: "User not found", errors: { email: `Email not found -  ${payload.data.email}` } });
    }

    const isPasswordValid = await Bun.password.verify(payload.data.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: 401, message: "Invalid password", errors: { password: "Invalid password" } });
    }

    const jwtPaylaod = {
      id: user.id,
      name: user.name,
      email: user.email,
    }

    const JWTtoken = jwt.sign(jwtPaylaod, Bun.env.JWT_SECRET_KEY!, { expiresIn: "30d" });

    return res.status(200).json({
      status: 200,
      message: "Login successful", data: {
        ...jwtPaylaod,
        token: `Bearer ${JWTtoken}`
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error });
  }
});

router.post("/check/credentials", AuthRateLimitter, async (req: Request, res: Response) => {
  try {
    const payload = loginSchema.safeParse(req.body);
    if (!payload.success) {
      const error = payload.error as ZodError;
      return res.status(422).json({ status: 422, message: "Validation Error", errors: formatError(error) });
    }

    let user = await prisma.user.findUnique({ where: { email: payload.data.email } });
    if (!user || user === null) {
      return res.status(404).json({ status: 404, message: "User not found", errors: { email: `Email not found -  ${payload.data.email}` } });
    }

    const isPasswordValid = await Bun.password.verify(payload.data.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: 401, message: "Invalid password", errors: { password: "Invalid password" } });
    }

    return res.status(200).json({
      status: 200,
      message: "Login successful",
      data: {}
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error });
  }
});

router.get("/user", AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ status: 401, message: "Unauthorized" });
    }
    return res.status(200).json({ status: 200, message: "User found", data: user });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error });
  }
})

export default router;

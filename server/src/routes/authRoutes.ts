import { Router, type Request, type Response } from "express";
import { loginSchema, registerSchema } from "../validator/authValidator";
const router = Router();
import { ZodError } from "zod";
import { formatError, renderEmail } from "../views/helper";
import prisma from "../config/database";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { emailQueue, emailQueueName } from "../jobs/EmailJob";
import AuthMiddleware from "../middleware/AuthMiddleware";
import { AuthRateLimitter } from "../config/rate-limit";

router.post("/register", AuthRateLimitter, async (req: Request, res: Response) => {
  try {
    const payload = registerSchema.safeParse(req.body);
    if (!payload.success) {
      const error = payload.error as ZodError;
      res.status(422).json({ message: "Validation Error", errors: formatError(error) });
    } else {
      let user = await prisma.user.findUnique({ where: { email: payload.data.email } });
      if (user) {
        res.status(400).json({ message: "Email already exists" });
      }

      const token = uuidv4();
      const hashedToken = await bcrypt.hash(token, 10);
      const url = `${process.env.BASE_URL}/api/auth/verify/verify-email?email=${payload.data.email}&token=${token}`;

      const html = await renderEmail("email-varify", { name: payload.data.name, link: url });
      await emailQueue.add(emailQueueName, { to: payload.data.email, subject: "Verify Email", html });
      const saltRounds = 10;
      let newUser = await prisma.user.create({
        data: {
          name: payload.data.name,
          email: payload.data.email,
          password: await bcrypt.hash(payload.data.password, saltRounds),
          email_verify_token: hashedToken,
        }
      });
      res.status(200).json({ message: "Email sent successfully", data: newUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

router.post("/login", AuthRateLimitter, async (req: Request, res: Response) => {
  try {
    const payload = loginSchema.safeParse(req.body);
    if (!payload.success) {
      const error = payload.error as ZodError;
      return res.status(422).json({ message: "Validation Error", errors: formatError(error) });
    }

    let user = await prisma.user.findUnique({ where: { email: payload.data.email } });
    if (!user || user === null) {
      return res.status(404).json({ message: "User not found", errors: { email: `Email not found -  ${payload.data.email}` } });
    }

    const isPasswordValid = await bcrypt.compare(payload.data.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password", errors: { password: "Invalid password" } });
    }

    const jwtPaylaod = {
      id: user.id,
      name: user.name,
      email: user.email,
    }

    const JWTtoken = jwt.sign(jwtPaylaod, process.env.JWT_SECRET_KEY!, { expiresIn: "1h" });
    // res.cookie("token", JWTtoken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 60 * 60 * 1000 });

    return res.status(200).json({
      message: "Login successful", data: {
        ...jwtPaylaod,
        token: `Bearer ${JWTtoken}`
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

router.post("/check/credentials", AuthRateLimitter, async (req: Request, res: Response) => {
  try {
    const payload = loginSchema.safeParse(req.body);
    if (!payload.success) {
      const error = payload.error as ZodError;
      return res.status(422).json({ message: "Validation Error", errors: formatError(error) });
    }

    let user = await prisma.user.findUnique({ where: { email: payload.data.email } });
    if (!user || user === null) {
      return res.status(404).json({ message: "User not found", errors: { email: `Email not found -  ${payload.data.email}` } });
    }

    const isPasswordValid = await bcrypt.compare(payload.data.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password", errors: { password: "Invalid password" } });
    }

    return res.status(200).json({
      message: "Login successful",
      data: {}
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

router.get("/user", AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json({ message: "User found", data: user });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
})

export default router;

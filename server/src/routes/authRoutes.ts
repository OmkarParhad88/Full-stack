import { Router } from "express";
import { registerSchema } from "../validator/authValidator";
const router = Router();
import { ZodError } from "zod";
import { formatError, renderEmail } from "../views/helper";
import prisma from "../config/database";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { emailQueue, emailQueueName } from "../jobs/EmailJob";

router.post("/register", async (req, res) => {
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

router.post("/login", (req, res) => {
  // const payload = loginSchema.safeParse(req.body);
  // if (!payload.success) {
  //   return res.status(422).json(payload.error);
  // }
  res.send("Login");
});

export default router;

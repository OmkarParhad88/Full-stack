import { Router, type Request, type Response } from "express";
import prisma from "../config/database";
import bcrypt from "bcrypt";
import { renderEmail } from "../views/helper";
const router = Router();

router.get("/verify-email", async (req: Request, res: Response) => {
  const { email, token } = req.query;

  if (!email || !token) {
    return res.redirect("/api/auth/verify/verify-error");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
  });

  if (!user) {
    return res.redirect("/api/auth/verify/verify-error");
  }

  const isVerified = await bcrypt.compare(token as string, user.email_verify_token as string);

  if (!isVerified) {
    return res.redirect("/api/auth/verify/verify-error");
  }

  await prisma.user.update({
    where: {
      email: email as string,
    },
    data: {
      email_verify_token: null,
      email_verified_at: new Date().toISOString(),
    },
  });
  res.redirect(`${process.env.FRONTEND_URL}/login`)
});

router.get("/verify-error", async (req: Request, res: Response) => {
  const html = await renderEmail("emailVarifyError", {});
  res.send(html);
});

export default router;
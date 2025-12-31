import { Router, type Request, type Response } from "express";
import prisma from "../config/database";
import { type ZodError } from "zod";
import { createFightSchema, updateFightSchema } from "../validator/fightValidator";
import { deleteFile, upload } from "../config/fileSystem";
import { formatError } from "../views/helper";
import { PrismaClientInitializationError, PrismaClientKnownRequestError } from "@prisma/client/runtime/wasm-compiler-edge";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const fightes = await prisma.fight.findMany({
      where: {
        userId: Number(req.user?.id)
      },
      orderBy: {
        id: "asc"
      }
    });
    return res.status(200).json({ status: 200, message: "fightes fetched successfully", fightes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const fight = await prisma.fight.findUnique({
      where: {
        id: Number(req.params?.id)
      }
    });
    return res.status(200).json({ status: 200, message: "fight fetched successfully", fight });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error });
  }
});

router.put("/:id", upload.single('image'), async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const file = req.file;
    const data = {
      ...(body?.title && { title: body.title }),
      ...(body?.description && { description: body.description }),
      ...(body?.expire_at && { expire_at: new Date(body.expire_at) }),
      ...(file && { image: file })
    }
    const payload = updateFightSchema.safeParse(data);

    if (!payload.success) {
      const error = payload.error as ZodError;
      return res.status(422).json({ status: 422, message: "Validation Error", errors: formatError(error) });
    }

    const fight = await prisma.fight.findUnique({
      where: {
        id: Number(req.params?.id)
      }
    });

    if (!fight) {
      return res.status(404).json({ status: 404, message: "fight not found" });
    }

    if (file) {
      if (fight.image) {
        if (deleteFile(fight.image)) {
          console.log("File deleted successfully");
        }
      }
    }

    const updatedfight = await prisma.fight.update({
      where: {
        id: Number(req.params?.id)
      },
      data: payload.data
    });
    return res.status(200).json({ status: 200, message: "fight updated successfully", updatedfight });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const fight = await prisma.fight.findUnique({
      where: {
        id: Number(req.params?.id)
      }
    });
    if (!fight) {
      return res.status(404).json({ status: 404, message: "fight not found" });
    }
    if (fight.image) {
      if (deleteFile(fight.image)) {
        console.log("File deleted successfully");
      }
    }
    const deletedfight = await prisma.fight.delete({
      where: {
        id: Number(req.params?.id)
      }
    });
    return res.status(200).json({ status: 200, message: "fight deleted successfully", deletedfight });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error });
  }
});

router.post("/", upload.single('image'), async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const file = req.file;
    const data = {
      title: body.title,
      description: body.description,
      expire_at: new Date(body.expire_at),
      image: file
    }
    const payload = createFightSchema.safeParse(data);

    if (!payload.success) {
      const error = payload.error as ZodError;
      return res.status(422).json({ status: 422, message: "Validation Error", errors: formatError(error) });
    }
    const user = req.user;
    const fight = await prisma.fight.create({
      data: {
        ...payload.data,
        user: {
          connect: {
            id: Number(user?.id)
          }
        }
      }
    });
    return res.status(200).json({ status: 200, message: "fight created successfully", fight });
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      return res.status(400).json({ status: 400, message: "Prisma Client Initialization Error", error: error });
    }
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error });
  }
});

export default router;
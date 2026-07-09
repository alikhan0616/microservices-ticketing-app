import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@akmicrotix/common";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Invalid ticketId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.status(200).json({ message: "Create order route" });
  },
);

export { router as createOrderRouter };

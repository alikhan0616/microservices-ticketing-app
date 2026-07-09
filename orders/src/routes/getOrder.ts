import express, { Request, Response } from "express";

const router = express.Router();

router.get("/orders/:OrderId", async (req: Request, res: Response) => {
  res.status(200).json({ message: "Get order route" });
});

export { router as getOrderRouter };

import express, { Request, Response } from "express";

const router = express.Router();

router.post("/orders", async (req: Request, res: Response) => {
  res.status(200).json({ message: "Create order route" });
});

export { router as createOrderRouter };

import express, { Request, Response } from "express";

const router = express.Router();

router.delete("/orders/:OrderId", async (req: Request, res: Response) => {
  res.status(200).json({ message: "Delete order route" });
});

export { router as deleteOrderRouter };

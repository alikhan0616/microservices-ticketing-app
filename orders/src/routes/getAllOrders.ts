import express, { Request, Response } from "express";

const router = express.Router();

router.get("/orders", async (req: Request, res: Response) => {
  res.status(200).json({ message: "Get all orders route" });
});

export { router as getAllOrdersRouter };

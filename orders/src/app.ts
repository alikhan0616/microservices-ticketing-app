import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@akmicrotix/common";
import { currentUser } from "@akmicrotix/common";
import { deleteOrderRouter } from "./routes/deleteOrder";
import { getAllOrdersRouter } from "./routes/getAllOrders";
import { createOrderRouter } from "./routes/createOrder";
import { getOrderRouter } from "./routes/getOrder";

export const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  }),
);

app.use(currentUser);

app.use(getAllOrdersRouter);
app.use(createOrderRouter);
app.use(getOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

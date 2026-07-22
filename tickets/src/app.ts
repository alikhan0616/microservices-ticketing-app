import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@akmicrotix/common";
import { createTicketRouter } from "./routes/createTicket";
import { currentUser } from "@akmicrotix/common";
import { getTicketRouter } from "./routes/getTicket";
import { getAllTicketsRouter } from "./routes/getAllTickets";
import { updateTicketRouter } from "./routes/updateTicket";

export const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  }),
);

app.use(currentUser);

app.use(createTicketRouter);
app.use(getTicketRouter);
app.use(getAllTicketsRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

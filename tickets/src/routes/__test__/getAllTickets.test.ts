import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/authHelper";

const createTicket = async (iteration: number) => {
  for (let i = 0; i < iteration; i++) {
    await request(app).post("/api/tickets").set("Cookie", signin()).send({
      title: "Test Ticket",
      price: 20,
    });
  }
};

it("fetches a list of tickets", async () => {
  await createTicket(3);
  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});

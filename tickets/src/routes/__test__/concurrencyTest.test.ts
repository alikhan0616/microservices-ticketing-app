import { Ticket } from "../../models/ticketSchema";

it("implemnts optimistic concurrency control", async () => {
  // Create Instance of ticket and save tickt to database

  const ticket = await Ticket.create({
    title: "Test Ticket",
    price: 200,
    userId: "123",
  });

  // fetech the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to the tickts we fetched
  firstInstance?.set({ price: 20 });
  secondInstance?.set({ price: 25 });

  // save the first fetched ticktet
  await firstInstance?.save();

  // save the second fetched tickt
  await expect(secondInstance?.save()).rejects.toThrow();
});

it("increments the ver no on multiple saves", async () => {
  const ticket = await Ticket.create({
    title: "Test Ticket",
    price: 200,
    userId: "123",
  });

  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});

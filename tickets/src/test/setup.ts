import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

jest.mock("../nats-wrapper.ts");

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "absdiaja";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  try {
    await mongoose.connect(mongoUri, {});
  } catch (err) {
    console.error(err);
  }
});

beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {});

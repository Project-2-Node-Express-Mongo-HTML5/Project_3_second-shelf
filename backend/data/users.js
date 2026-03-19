import { ObjectId } from "mongodb";
import { getDb } from "../config/mongo.js";

export async function findUserByEmail(email) {
  const db = getDb();
  return db.collection("users").findOne({ email });
}

export async function findUserById(id) {
  const db = getDb();
  return db.collection("users").findOne({
    _id: new ObjectId(id),
  });
}

export async function createUser({ name, email, passwordHash }) {
  const db = getDb();

  const result = await db.collection("users").insertOne({
    name,
    email,
    passwordHash,
    createdAt: new Date(),
  });

  return db.collection("users").findOne({
    _id: result.insertedId,
  });
}

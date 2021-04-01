import { ObjectId } from "bson";
import { connectToDatabase } from "./mongodb";

export default async function getUserData(uid) {
  const { db } = await connectToDatabase()
  
  const user = await db
    .collection('users')
    .findOne({
      _id: ObjectId(uid)
    })

  return user
}
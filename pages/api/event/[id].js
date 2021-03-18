import { ObjectId } from 'bson'
import getUserName from '../../../util/getUserName'
import { connectToDatabase } from '../../../util/mongodb'

export default async ({ query: { id } }, res) => {
  const { db } = await connectToDatabase()

  let ObjId

  try {
    ObjId = ObjectId(id)
  } catch {
    res.status(404)
    res.send({ error: "not found" })
    return
  }

  const data = await db
    .collection('events')
    .findOne({
      _id: ObjId
    })

  if(data) {
    res.send({
      name:         unescape(data.name),
      description:  unescape(data.description),
      contributor:  await getUserName(data.contributor_id),
      schedule:     data.schedule
    })
  } else {
    res.status(404)
    res.send({ error: "not found" })
  }
}
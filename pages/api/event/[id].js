import { connectToDatabase } from '../../../util/mongodb'

export default async ({ query: { id } }, res) => {

  const { db } = await connectToDatabase()

  const data = await db
    .collection('events')
    .findOne({
      eventID: id
    })

  if(data) {
    res.send({
      name:         unescape(data.name),
      description:  unescape(data.description),
      contributor:  data.contributor,
      schedule:     data.schedule
    })
  } else {
    res.status(404)
    res.send({ error: "not found" })
  }
}
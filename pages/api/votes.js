import { ObjectId } from 'bson'
import getUserData from '../../util/getUserData'
import { connectToDatabase } from '../../util/mongodb'

export default async (req, res) => {
  const { db } = await connectToDatabase()

  const id = ObjectId(req.query.id)
  const datetime = new Date(req.query.datetime)
  const evaluation = req.query.evaluation

  const votes = await db
    .collection('votes')
    .find({
      event_id: id,
      datetime: datetime,
      evaluation: evaluation
    })
    .toArray()

  res.send(await Promise.all(votes.map(async vote => {
    const user = await getUserData(vote.user_id)
    return {
      name: user.name,
      image: user.image
    }
  })))
}

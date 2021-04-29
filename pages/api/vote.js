import { ObjectId } from 'bson'
import { getSession } from 'next-auth/client'
import { connectToDatabase } from '../../util/mongodb'
import { validateDatetime } from '../../util/validate'

export default async (req, res) => {
  const session = await getSession({ req })

  if (session) {
    const { db } = await connectToDatabase()

    const userId = session.user.uid
    const operation = req.body.operation
    const id = ObjectId(req.body.id)
    const datetime = new Date(req.body.datetime)
    const evaluation = req.body.evaluation

    // バリデートする

    if(operation == 'add') {
      await db
        .collection('votes')
        .deleteOne({
          user_id: userId,
          event_id: id,
          datetime: datetime
        })
      
      await db
        .collection('votes')
        .insertOne({
          user_id: userId,
          event_id: id,
          datetime: datetime,
          evaluation: evaluation,
          createdAt: new Date(Date.now())
        })

    } else if (operation == "remove") {
      await db
        .collection('votes')
        .deleteOne({
          user_id: userId,
          event_id: id,
          datetime: datetime,
          evaluation: evaluation
        })

    } else {
      res.status(400)
      return
    }

    res.send({ "success": true })

  } else {
    res.status(401)
  }
}
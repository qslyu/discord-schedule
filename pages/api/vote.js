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
    const id = req.body.id
    const datetime = new Date(req.body.datetime)
    const evaluation = req.body.evaluation

    if(validateDatetime())

    if(operation == 'add') {
      const deleted = await db
        .collection('votes')
        .findOneAndDelete({
          user_id: userId,
          event_id: id,
          datetime: datetime
        })
      
      if(deleted.value) {
        await db
          .collection('events')
          .updateOne({
            _id: ObjectId(id),
            'schedule.datetime': datetime,
          }, {
            $inc: {[`schedule.$.evaluation_count.${deleted.value.evaluation}`]: -1 }
          })
      }

      await db
        .collection('votes')
        .insertOne({
          user_id: userId,
          event_id: id,
          datetime: datetime,
          evaluation: evaluation,
          createdAt: new Date(Date.now())
        })

      await db
        .collection('events')
        .updateOne({
          _id: ObjectId(id),
          'schedule.datetime': datetime,
        }, {
          $inc: {[`schedule.$.evaluation_count.${evaluation}`]: 1 },
          $set: { 'schedule.$.evaluation': evaluation }
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

      await db
        .collection('events')
        .updateOne({
          _id: ObjectId(id),
          'schedule.datetime': datetime,
        }, {
          $inc: {[`schedule.$.evaluation_count.${evaluation}`]: -1 },
          $set: { 'schedule.$.evaluation': '' }
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
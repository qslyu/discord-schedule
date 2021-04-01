import { ObjectId } from 'bson'
import { getSession } from 'next-auth/client'
import { connectToDatabase } from '../../util/mongodb'

export default async (req, res) => {
  const session = await getSession({ req })

  if (session) {
    const { db } = await connectToDatabase()

    const userId = session.user.uid
    const operation = req.body.operation
    const id = req.body.id
    const date = req.body.date
    const evaluation = req.body.evaluation

    if(operation == 'add') {
      await db
        .collection('events')
        .update({
          _id: ObjectId(id)
        }, {
          $pull: {
            evaluations : {
              user_id: userId,
              date: date
            }
          },
          $push: {
            evaluations : {
              user_id: userId,
              date: date,
              evaluation: evaluation
            }
          }
        })
    } else if (operation == "remove") {
      await db
        .collection('events')
        .update({
          _id: ObjectId(id)
        }, {
          $pull: {
            evaluations : {
              user_id: userId,
              date: date
            }
          }
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
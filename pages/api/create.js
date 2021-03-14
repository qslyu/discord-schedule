import { getSession } from 'next-auth/client'
import { connectToDatabase } from '../../util/mongodb'
import { validateEventName, validateDescription, validateSchedule } from '../../util/validate'

export default async (req, res) => {
  const session = await getSession({ req })

  if (session) {
    const { db } = await connectToDatabase()

    let id
    const userId = session.user.uid
    const eventName = req.body.name
    const description = req.body.description
    const schedule = req.body.schedule

    if(
      validateEventName(eventName) &&
      validateDescription(description) &&
      validateSchedule(schedule)
    ) {
      res.status(400)
      return
    }

    schedule.sort((a,b) => {
      const ad = new Date(a).getTime()
      const bd = new Date(b).getTime()
      if( ad < bd ) return -1;
      if( ad > bd ) return 1;
      return 0;
    })

    const escapedSchedule = []
    schedule.map(d => {
      escapedSchedule.push({
        date: new Date(d), 
        users: {
          excellent: [],
          average: [],
          bad: []
        }
      })
    })

    await db
      .collection('events')
      .insertOne({
        contributor_id: userId,
        name:         escape(eventName),
        description:  escape(description),
        schedule: escapedSchedule,
        createdAt: new Date(Date.now())
      })
      .then((result) => {
        id = result.insertedId
      })

    res.send({ "success": true, "url": `/event/${id}` })
  } else {
    res.status(401)
  }
}
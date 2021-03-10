import { getSession } from 'next-auth/client'
import { v4 as uuidv4 } from 'uuid'
import { connectToDatabase } from '../../../util/mongodb'
import { validateEventName, validateDescription, validateSchedule } from '../../../util/validate'

export default async (req, res) => {
  const session = await getSession({ req })

  if (session) {
    const { db } = await connectToDatabase()

    const id =  uuidv4()
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
        eventID: id,
        contributor: {
          name: session.user.name,
          email: session.user.email
        },
        name:         escape(eventName),
        description:  escape(description),
        schedule: escapedSchedule,
        createdAt: new Date(Date.now())
      })
    res.send({ "success": true, "url": `/event/${id}` })
  } else {
    res.status(401)
  }
}
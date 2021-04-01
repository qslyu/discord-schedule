import { ObjectId } from "bson"
import { createCanvas, loadImage, registerFont } from "canvas"
import getUserData from "../../../util/getUserData"
import { connectToDatabase } from '../../../util/mongodb'
import path from 'path'

export default async ({ query: { id } }, res) => {
  const { db } = await connectToDatabase()

  let ObjId

  try {
    ObjId = ObjectId(id)
  } catch {
    res.status(404)
    res.send('Not found')
    return
  }

  const data = await db
  .collection('events')
  .findOne({
    _id: ObjId
  })

  if(!data) {
    res.status(404)
    res.send('Not found')
    return
  }

  const contributor = await getUserData(data.contributor_id)

  const canvas = createCanvas(1200, 630)
  const logo = await loadImage(path.resolve('./public/logo.svg'))
  const icon = await loadImage(contributor.image)

  const ctx = canvas.getContext('2d')

  

  ctx.drawImage(icon, 125, 462, 80, 80)

  ctx.globalCompositeOperation='destination-in'

  ctx.beginPath()
  ctx.arc(165, 502, 40, 0, Math.PI*2)
  ctx.fill()

  ctx.globalCompositeOperation='destination-over'

  ctx.fillStyle = "#FFF"
  ctx.fillRect(0, 0, 1200, 630)

  ctx.globalCompositeOperation='source-over'

  ctx.font = '60px "Noto Sans CJK"'
  ctx.fillStyle = '#000000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(unescape(data.name), 600, 300)

  ctx.font = '35px "Noto Sans CJK"'
  ctx.fillText(contributor.name, 350, 500)

  ctx.font = '25px "Noto Sans CJK"'
  ctx.drawImage(logo, 775, 78, 68, 45)
  ctx.fillText('Discord Schedule', 960, 100)

  
  const buffer = canvas.toBuffer()

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': buffer.length,
  })
  res.end(buffer, 'binary')
}
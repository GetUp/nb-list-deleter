import fetch from 'node-fetch'
import Bottleneck from 'bottleneck'

const token = process.env.NB_TOKEN
const nation = process.env.NB_NATION
const idString = process.env.IDS || ''

const ids = idString.split(",")
const total = ids.length

const url = id => `https://${nation}.nationbuilder.com/api/v1/lists/${id}?access_token=${token}`
const limiter = new Bottleneck({ minTime: 100 })
const deleteList = id => fetch(url(id), { method: 'DELETE' })

const go = async (id, i) => {
  const r = await limiter.schedule(() => deleteList(id))
  if (!r.ok) {
    const msg = await r.text()
    console.error(`${id} => Failed with: ${msg}`)
  } else {
    console.log(`${id} => ${Math.round(i / total * 100)}%`)
  }
}

ids.forEach(go)

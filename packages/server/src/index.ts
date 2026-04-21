import cors from 'cors'
import express from 'express'
import { router } from './api/routes'

const app = express()
const port = Number(process.env.PORT ?? 3000)

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use('/api', router)

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`)
})

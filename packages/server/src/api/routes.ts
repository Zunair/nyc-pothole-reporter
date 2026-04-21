import { Router } from 'express'
import { ComplaintDto } from '../domain/Complaint'
import { SqliteComplaintRepository } from '../repositories/SqliteComplaintRepository'
import { NominatimReverseGeocoder } from '../services/NominatimReverseGeocoder'

const router = Router()
const repository = new SqliteComplaintRepository()
const geocoder = new NominatimReverseGeocoder(
  process.env.NOMINATIM_USER_AGENT ??
    'nyc-pothole-reporter/1.0 (contact:opensource@example.com)',
)

router.get('/health', (_req, res) => {
  res.json({ ok: true })
})

router.get('/geocode/reverse', async (req, res) => {
  const lat = Number(req.query.lat)
  const lng = Number(req.query.lng)

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ message: 'lat and lng are required' })
  }

  try {
    const address = await geocoder.reverse(lat, lng)
    return res.json({ address })
  } catch (error) {
    return res.status(502).json({ message: (error as Error).message })
  }
})

router.post('/complaints', async (req, res) => {
  const complaint = req.body as ComplaintDto
  await repository.save(complaint)
  res.status(201).json({ ok: true })
})

router.get('/complaints', async (_req, res) => {
  const complaints = await repository.list()
  res.json(complaints)
})

export { router }

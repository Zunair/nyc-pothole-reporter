import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Complaint } from './domain/Complaint'
import { Location } from './domain/Location'
import { Photo } from './domain/Photo'
import type { ComplaintStatus } from './domain/types'
import { useComplaints } from './hooks/useComplaints'
import { BrowserGeolocationService } from './services/BrowserGeolocationService'
import { ComplaintStatusTracker } from './services/ComplaintStatusTracker'
import { NominatimReverseGeocoder } from './services/NominatimReverseGeocoder'
import { PhotoService } from './services/PhotoService'
import { DisclaimerBanner } from './ui/DisclaimerBanner'
import { complaintsToCsv, complaintsToJson } from './utils/export'

const OFFICIAL_FORM_URL =
  'https://a841-dotvweb01.nyc.gov/potholeform/ViewController/CreateComplaint.aspx'

function download(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const boroughOptions = ['Manhattan', 'Bronx', 'Brooklyn', 'Queens', 'Staten Island']
const statusOptions: ComplaintStatus[] = [
  'draft',
  'submitted',
  'acknowledged',
  'in_progress',
  'completed',
  'rejected',
]

function App() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'
  const geolocationService = useMemo(() => new BrowserGeolocationService(), [])
  const reverseGeocoder = useMemo(() => new NominatimReverseGeocoder(apiBaseUrl), [apiBaseUrl])
  const photoService = useMemo(() => new PhotoService(), [])
  const statusTracker = useMemo(() => new ComplaintStatusTracker(), [])
  const { complaints, save, refresh } = useComplaints(apiBaseUrl)

  const [address, setAddress] = useState('')
  const [borough, setBorough] = useState('')
  const [crossStreets, setCrossStreets] = useState('')
  const [description, setDescription] = useState('')
  const [locationOnStreet, setLocationOnStreet] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [location, setLocation] = useState<Location | undefined>()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [syncToBackend, setSyncToBackend] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | ComplaintStatus>('all')
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    refresh().catch(console.error)
  }, [refresh])

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter
    const target = `${complaint.address} ${complaint.description} ${complaint.borough}`.toLowerCase()
    return matchesStatus && target.includes(searchText.toLowerCase())
  })

  const copyField = async (value: string): Promise<void> => {
    await navigator.clipboard.writeText(value)
  }

  const handleGetLocation = async (): Promise<void> => {
    const current = await geolocationService.getCurrentLocation()
    const enriched = await reverseGeocoder.reverse(current)
    setLocation(enriched)
    setAddress(enriched.displayAddress)
  }

  const handlePhotoSelection = async (files: FileList | null): Promise<void> => {
    if (!files) return
    const compressed = await Promise.all(Array.from(files).map((file) => photoService.compress(file)))
    setPhotos((prev) => [...prev, ...compressed])
  }

  const createComplaint = (): Complaint =>
    new Complaint({
      id: crypto.randomUUID(),
      address,
      borough,
      crossStreets,
      description,
      locationOnStreet,
      contactName,
      contactEmail,
      contactPhone,
      location,
      photos,
      status: 'draft',
    })

  const handleSaveDraft = async (): Promise<void> => {
    await save(createComplaint(), syncToBackend)
  }

  const handleMarkSubmitted = async (): Promise<void> => {
    const complaint = createComplaint()
    statusTracker.transition(complaint, 'submitted')
    await save(complaint, syncToBackend)
  }

  return (
    <main>
      <h1>NYC Pothole Reporter Assistant</h1>
      <DisclaimerBanner />
      <p>
        This tool helps prepare details. You must manually submit on the official NYC page.
      </p>

      <section className="card">
        <h2>1) Capture location</h2>
        <button onClick={handleGetLocation}>Get current location</button>
        {location && (
          <div>
            <p>Latitude: {location.latitude.toFixed(6)}</p>
            <p>Longitude: {location.longitude.toFixed(6)}</p>
          </div>
        )}
      </section>

      <section className="card">
        <h2>2) Add photos</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={(event) => {
            void handlePhotoSelection(event.target.files)
          }}
        />
        <p>{photos.length} photo(s) selected</p>
      </section>

      <section className="card">
        <h2>3) Form assistance</h2>
        <label>
          Address
          <input value={address} onChange={(event) => setAddress(event.target.value)} />
          <button onClick={() => void copyField(address)}>Copy</button>
        </label>
        <label>
          Borough
          <select value={borough} onChange={(event) => setBorough(event.target.value)}>
            <option value="">Select</option>
            {boroughOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button onClick={() => void copyField(borough)}>Copy</button>
        </label>
        <label>
          Cross-streets
          <input value={crossStreets} onChange={(event) => setCrossStreets(event.target.value)} />
          <button onClick={() => void copyField(crossStreets)}>Copy</button>
        </label>
        <label>
          Description
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
          <button onClick={() => void copyField(description)}>Copy</button>
        </label>
        <label>
          Location on street
          <input
            value={locationOnStreet}
            onChange={(event) => setLocationOnStreet(event.target.value)}
          />
          <button onClick={() => void copyField(locationOnStreet)}>Copy</button>
        </label>
        <label>
          Contact name (optional)
          <input value={contactName} onChange={(event) => setContactName(event.target.value)} />
          <button onClick={() => void copyField(contactName)}>Copy</button>
        </label>
        <label>
          Contact email (optional)
          <input value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} />
          <button onClick={() => void copyField(contactEmail)}>Copy</button>
        </label>
        <label>
          Contact phone (optional)
          <input value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} />
          <button onClick={() => void copyField(contactPhone)}>Copy</button>
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={syncToBackend}
            onChange={(event) => setSyncToBackend(event.target.checked)}
          />
          Sync to backend API
        </label>

        <div className="actions">
          <button onClick={handleSaveDraft}>Save draft</button>
          <button onClick={handleMarkSubmitted}>Mark as submitted</button>
          <button onClick={() => window.open(OFFICIAL_FORM_URL, '_blank', 'noopener,noreferrer')}>
            Open official NYC form
          </button>
        </div>
      </section>

      <section className="card">
        <h2>4) Local complaint tracker</h2>
        <div className="filters">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | ComplaintStatus)}
          >
            <option value="all">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input
            placeholder="Search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>

        <div className="actions">
          <button
            onClick={() =>
              download('complaints.json', complaintsToJson(filteredComplaints), 'application/json')
            }
          >
            Export JSON
          </button>
          <button
            onClick={() =>
              download('complaints.csv', complaintsToCsv(filteredComplaints), 'text/csv')
            }
          >
            Export CSV
          </button>
        </div>

        <ul>
          {filteredComplaints.map((complaint) => (
            <li key={complaint.id}>
              <strong>{complaint.status}</strong> — {complaint.address || 'No address'}
              <div>{complaint.description}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App

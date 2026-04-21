import { describe, expect, test } from 'vitest'
import { Complaint } from '../Complaint'
import { Photo } from '../Photo'
import { ComplaintStatusTracker } from '../../services/ComplaintStatusTracker'
import { complaintsToCsv } from '../../utils/export'

describe('Complaint domain', () => {
  test('adds photos and tracks status transitions', () => {
    const complaint = new Complaint({
      id: 'c1',
      address: '123 Example St',
      borough: 'Queens',
      crossStreets: 'A & B',
      description: 'Large pothole',
      locationOnStreet: 'Right lane',
    })

    complaint.addPhoto(new Photo('p1', 'data:image/jpeg;base64,abc', 'image/jpeg'))
    new ComplaintStatusTracker().transition(complaint, 'submitted')

    expect(complaint.photos).toHaveLength(1)
    expect(complaint.status).toBe('submitted')
    expect(complaint.statusHistory.at(-1)?.status).toBe('submitted')
  })

  test('exports CSV rows', () => {
    const complaint = new Complaint({
      id: 'c2',
      address: 'Addr',
      borough: 'Manhattan',
      crossStreets: 'X/Y',
      description: 'desc',
      locationOnStreet: 'middle',
    })

    const csv = complaintsToCsv([complaint])
    expect(csv).toContain('id,status,address')
    expect(csv).toContain('"c2"')
  })
})

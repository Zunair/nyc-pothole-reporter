import { ComplaintStatus } from './types'

export interface ComplaintDto {
  id: string
  address: string
  borough: string
  crossStreets: string
  description: string
  locationOnStreet: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  location?: {
    latitude: number
    longitude: number
    displayAddress: string
  }
  photos: Array<{
    id: string
    dataUrl: string
    mimeType: string
    createdAt: string
  }>
  status: ComplaintStatus
  statusHistory: Array<{
    status: ComplaintStatus
    createdAt: string
    note?: string
  }>
  createdAt: string
  updatedAt: string
}

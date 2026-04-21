import { Location } from './Location'
import { Photo } from './Photo'
import { StatusEvent } from './StatusEvent'
import type { ComplaintStatus } from './types'

export interface ComplaintProps {
  id: string
  address: string
  borough: string
  crossStreets: string
  description: string
  locationOnStreet: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  location?: Location
  photos?: Photo[]
  status?: ComplaintStatus
  statusHistory?: StatusEvent[]
  createdAt?: string
  updatedAt?: string
}

export class Complaint {
  public readonly id: string
  public address: string
  public borough: string
  public crossStreets: string
  public description: string
  public locationOnStreet: string
  public contactName?: string
  public contactEmail?: string
  public contactPhone?: string
  public location?: Location
  public photos: Photo[]
  public status: ComplaintStatus
  public statusHistory: StatusEvent[]
  public readonly createdAt: string
  public updatedAt: string

  constructor(props: ComplaintProps) {
    this.id = props.id
    this.address = props.address
    this.borough = props.borough
    this.crossStreets = props.crossStreets
    this.description = props.description
    this.locationOnStreet = props.locationOnStreet
    this.contactName = props.contactName
    this.contactEmail = props.contactEmail
    this.contactPhone = props.contactPhone
    this.location = props.location
    this.photos = props.photos ?? []
    this.status = props.status ?? 'draft'
    this.statusHistory = props.statusHistory ?? [new StatusEvent(this.status)]
    this.createdAt = props.createdAt ?? new Date().toISOString()
    this.updatedAt = props.updatedAt ?? this.createdAt
  }

  public addPhoto(photo: Photo): void {
    this.photos.push(photo)
    this.touch()
  }

  public updateStatus(status: ComplaintStatus, note?: string): void {
    this.status = status
    this.statusHistory.push(new StatusEvent(status, new Date().toISOString(), note))
    this.touch()
  }

  private touch(): void {
    this.updatedAt = new Date().toISOString()
  }
}

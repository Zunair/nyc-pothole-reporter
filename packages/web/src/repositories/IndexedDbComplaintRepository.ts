import Dexie, { type Table } from 'dexie'
import { Complaint } from '../domain/Complaint'
import { Location } from '../domain/Location'
import { Photo } from '../domain/Photo'
import { StatusEvent } from '../domain/StatusEvent'
import { ComplaintRepository } from './ComplaintRepository'

type ComplaintRecord = Omit<Complaint, 'addPhoto' | 'updateStatus'>

class ComplaintDb extends Dexie {
  complaints!: Table<ComplaintRecord, string>

  constructor() {
    super('nycPotholeReporter')
    this.version(1).stores({
      complaints: 'id,status,updatedAt,address,borough',
    })
  }
}

export class IndexedDbComplaintRepository extends ComplaintRepository {
  private readonly db = new ComplaintDb()

  async save(complaint: Complaint): Promise<void> {
    await this.db.complaints.put(this.serialize(complaint))
  }

  async list(): Promise<Complaint[]> {
    const rows = await this.db.complaints.orderBy('updatedAt').reverse().toArray()
    return rows.map((row) => this.deserialize(row))
  }

  async getById(id: string): Promise<Complaint | undefined> {
    const row = await this.db.complaints.get(id)
    return row ? this.deserialize(row) : undefined
  }

  private serialize(complaint: Complaint): ComplaintRecord {
    return JSON.parse(JSON.stringify(complaint)) as ComplaintRecord
  }

  private deserialize(row: ComplaintRecord): Complaint {
    return new Complaint({
      ...row,
      location: row.location
        ? new Location(
            row.location.latitude,
            row.location.longitude,
            row.location.displayAddress,
          )
        : undefined,
      photos: row.photos.map(
        (photo) =>
          new Photo(photo.id, photo.dataUrl, photo.mimeType, photo.createdAt),
      ),
      statusHistory: row.statusHistory.map(
        (event) => new StatusEvent(event.status, event.createdAt, event.note),
      ),
    })
  }
}

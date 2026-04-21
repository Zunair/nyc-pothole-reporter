import { Complaint } from '../domain/Complaint'

export abstract class ComplaintRepository {
  abstract save(complaint: Complaint): Promise<void>
  abstract list(): Promise<Complaint[]>
  abstract getById(id: string): Promise<Complaint | undefined>
}

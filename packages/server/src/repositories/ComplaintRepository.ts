import { ComplaintDto } from '../domain/Complaint'

export abstract class ComplaintRepository {
  abstract save(complaint: ComplaintDto): Promise<void>
  abstract list(): Promise<ComplaintDto[]>
}

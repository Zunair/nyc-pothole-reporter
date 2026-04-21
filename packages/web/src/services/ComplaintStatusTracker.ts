import { Complaint } from '../domain/Complaint'
import type { ComplaintStatus } from '../domain/types'

export class ComplaintStatusTracker {
  transition(complaint: Complaint, status: ComplaintStatus, note?: string): Complaint {
    complaint.updateStatus(status, note)
    return complaint
  }
}

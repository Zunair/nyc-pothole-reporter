import { Complaint } from '../domain/Complaint'

export function complaintsToJson(complaints: Complaint[]): string {
  return JSON.stringify(complaints, null, 2)
}

export function complaintsToCsv(complaints: Complaint[]): string {
  const header = 'id,status,address,borough,crossStreets,description,locationOnStreet,updatedAt'
  const rows = complaints.map((complaint) =>
    [
      complaint.id,
      complaint.status,
      complaint.address,
      complaint.borough,
      complaint.crossStreets,
      complaint.description,
      complaint.locationOnStreet,
      complaint.updatedAt,
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(','),
  )
  return [header, ...rows].join('\n')
}

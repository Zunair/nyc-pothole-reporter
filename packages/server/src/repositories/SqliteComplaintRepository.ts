import { PrismaClient } from '@prisma/client'
import { ComplaintDto } from '../domain/Complaint'
import { ComplaintRepository } from './ComplaintRepository'

const prisma = new PrismaClient()

export class SqliteComplaintRepository extends ComplaintRepository {
  async save(complaint: ComplaintDto): Promise<void> {
    await prisma.complaint.upsert({
      where: { id: complaint.id },
      create: {
        id: complaint.id,
        address: complaint.address,
        borough: complaint.borough,
        crossStreets: complaint.crossStreets,
        description: complaint.description,
        locationOnStreet: complaint.locationOnStreet,
        contactName: complaint.contactName,
        contactEmail: complaint.contactEmail,
        contactPhone: complaint.contactPhone,
        latitude: complaint.location?.latitude,
        longitude: complaint.location?.longitude,
        displayAddress: complaint.location?.displayAddress,
        status: complaint.status,
        createdAt: new Date(complaint.createdAt),
        updatedAt: new Date(complaint.updatedAt),
        photos: {
          create: complaint.photos.map((photo) => ({
            id: photo.id,
            dataUrl: photo.dataUrl,
            mimeType: photo.mimeType,
            createdAt: new Date(photo.createdAt),
          })),
        },
        statusEvents: {
          create: complaint.statusHistory.map((event, index) => ({
            id: `${complaint.id}-${index}-${event.createdAt}`,
            status: event.status,
            note: event.note,
            createdAt: new Date(event.createdAt),
          })),
        },
      },
      update: {
        address: complaint.address,
        borough: complaint.borough,
        crossStreets: complaint.crossStreets,
        description: complaint.description,
        locationOnStreet: complaint.locationOnStreet,
        contactName: complaint.contactName,
        contactEmail: complaint.contactEmail,
        contactPhone: complaint.contactPhone,
        latitude: complaint.location?.latitude,
        longitude: complaint.location?.longitude,
        displayAddress: complaint.location?.displayAddress,
        status: complaint.status,
        updatedAt: new Date(complaint.updatedAt),
        photos: {
          deleteMany: {},
          create: complaint.photos.map((photo) => ({
            id: photo.id,
            dataUrl: photo.dataUrl,
            mimeType: photo.mimeType,
            createdAt: new Date(photo.createdAt),
          })),
        },
        statusEvents: {
          deleteMany: {},
          create: complaint.statusHistory.map((event, index) => ({
            id: `${complaint.id}-${index}-${event.createdAt}`,
            status: event.status,
            note: event.note,
            createdAt: new Date(event.createdAt),
          })),
        },
      },
    })
  }

  async list(): Promise<ComplaintDto[]> {
    const complaints = await prisma.complaint.findMany({
      include: {
        photos: true,
        statusEvents: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return complaints.map((complaint) => ({
      id: complaint.id,
      address: complaint.address,
      borough: complaint.borough,
      crossStreets: complaint.crossStreets,
      description: complaint.description,
      locationOnStreet: complaint.locationOnStreet,
      contactName: complaint.contactName ?? undefined,
      contactEmail: complaint.contactEmail ?? undefined,
      contactPhone: complaint.contactPhone ?? undefined,
      location:
        complaint.latitude !== null &&
        complaint.longitude !== null &&
        complaint.displayAddress !== null
          ? {
              latitude: complaint.latitude,
              longitude: complaint.longitude,
              displayAddress: complaint.displayAddress,
            }
          : undefined,
      photos: complaint.photos.map((photo) => ({
        id: photo.id,
        dataUrl: photo.dataUrl,
        mimeType: photo.mimeType,
        createdAt: photo.createdAt.toISOString(),
      })),
      status: complaint.status as ComplaintDto['status'],
      statusHistory: complaint.statusEvents.map((event) => ({
        status: event.status as ComplaintDto['status'],
        createdAt: event.createdAt.toISOString(),
        note: event.note ?? undefined,
      })),
      createdAt: complaint.createdAt.toISOString(),
      updatedAt: complaint.updatedAt.toISOString(),
    }))
  }
}

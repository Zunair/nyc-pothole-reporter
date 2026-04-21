import { useCallback, useMemo, useState } from 'react'
import { Complaint } from '../domain/Complaint'
import { ComplaintApiClient } from '../api/ComplaintApiClient'
import { IndexedDbComplaintRepository } from '../repositories/IndexedDbComplaintRepository'

const localRepository = new IndexedDbComplaintRepository()

export function useComplaints(apiBaseUrl: string) {
  const apiClient = useMemo(() => new ComplaintApiClient(apiBaseUrl), [apiBaseUrl])
  const [complaints, setComplaints] = useState<Complaint[]>([])

  const refresh = useCallback(async () => {
    setComplaints(await localRepository.list())
  }, [])

  const save = useCallback(async (complaint: Complaint, syncToBackend: boolean) => {
    await localRepository.save(complaint)
    if (syncToBackend) {
      await apiClient.save(complaint)
    }
    await refresh()
  }, [apiClient, refresh])

  return {
    complaints,
    save,
    refresh,
  }
}

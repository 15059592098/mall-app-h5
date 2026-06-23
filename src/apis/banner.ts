import { http } from '@/utils/http'
import type { SmsHomeAdvertise } from '@/types/home'

export const getAdvertiseListAPI = () => {
  return http<SmsHomeAdvertise[]>({
    method: 'GET',
    url: '/home/advertise/list',
  })
}

export const createAdvertiseAPI = (data: Partial<SmsHomeAdvertise>) => {
  return http({
    method: 'POST',
    url: '/home/advertise/create',
    data,
  })
}

export const updateAdvertiseAPI = (id: number, data: Partial<SmsHomeAdvertise>) => {
  return http({
    method: 'POST',
    url: `/home/advertise/update/${id}`,
    data,
  })
}

export const deleteAdvertiseAPI = (id: number) => {
  return http({
    method: 'POST',
    url: `/home/advertise/delete?id=${id}`,
  })
}

export const toggleAdvertiseStatusAPI = (id: number, status: number) => {
  return http({
    method: 'POST',
    url: `/home/advertise/toggleStatus?id=${id}&status=${status}`,
  })
}

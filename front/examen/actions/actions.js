import { server } from '../config'

export const getSpacecraft = (filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'GET_SPACECRAFT',
    payload: async () => {
      const response = await fetch(`${server}/spacecraft`)
      const data = await response.json()
      return data
    }
  }
}
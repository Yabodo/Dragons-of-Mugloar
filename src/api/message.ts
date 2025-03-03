import fetchApi from './config/config'
import type { Ad, AdResult } from '../types/ad'

export const adService = {
  async get(gameId: string): Promise<Ad[]> {
    return fetchApi(`/${gameId}/messages`)
  },
  
  async acceptAd(gameId: string, adId: string): Promise<AdResult> {
    return fetchApi(`/${gameId}/solve/${adId}`, {
      method: 'POST',
    })
  },
}
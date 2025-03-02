import fetchApi from './config/config'
import type { Reputation } from '../types/reputation'

export const investigationService = {
  async start(gameId: string): Promise<Reputation> {
    return fetchApi(`/${gameId}/investigate/reputation`, {
      method: 'POST',
    })
  },
}
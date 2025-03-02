import fetchApi from './config/config'
import type { Game } from '../types/game'

export const gameService = {
  async start(): Promise<Game> {
    return fetchApi('/game/start', {
      method: 'POST',
    })
  },
}
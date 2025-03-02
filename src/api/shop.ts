import fetchApi from './config/config'
import type { Item, ItemResult } from '../types/item'

export const shopService = {
  async get(gameId: string): Promise<Item[]> {
    return fetchApi(`/${gameId}/shop`)
  },
  
  async buy(gameId: string, itemId: string): Promise<ItemResult> {
    return fetchApi(`/${gameId}/shop/buy/${itemId}`, {
      method: 'POST',
    })
  },
}
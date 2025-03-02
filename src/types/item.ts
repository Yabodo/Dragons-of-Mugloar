export interface Item {
  id: string
  name: string
  cost: number
}

export interface ItemResult {
  shoppingSuccess: boolean
  gold: number
  lives: number
  level: number
  turn: number
}
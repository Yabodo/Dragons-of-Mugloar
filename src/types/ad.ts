type ProbabilityLevel =
  | 'Piece of cake'
  | 'Sure thing'
  | 'Walk in the park'
  | 'Quite likely'
  | 'Gamble'
  | 'Risky'
  | 'Hmmm....'
  | 'Rather detrimental'
  | 'Suicide mission'
  | 'Playing with fire'
  | 'Impossible'
  | string

export interface Ad {
  adId: string
  message: string
  probability: ProbabilityLevel
  reward: number //API Issue
  expiresIn: number
  encrypted: null | boolean
}

export interface AdResult {
  success: boolean
  lives: number
  gold: number
  score: number
  highScore: number
  turn: number
  message: string
}

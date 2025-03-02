import { describe, it, expect } from 'vitest'
import router from '../index'

describe('Router', () => {
  it('should have correct routes', () => {
    const routes = router.options.routes

    expect(routes).toHaveLength(3)
    expect(routes[0].path).toBe('/')
    expect(routes[1].path).toBe('/play')
    expect(routes[2].path).toBe('/autoplay')
  })
})

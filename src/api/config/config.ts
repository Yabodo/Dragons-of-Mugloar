const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dragonsofmugloar.com'

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function fetchApi(endpoint: string, options: RequestOptions = {}) {
  const { params, ...init } = options
  const apiEndpoint = "/api/v2" + endpoint
  
  // Build URL with query parameters if they exist
  const url = new URL(apiEndpoint, API_BASE_URL)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  // Default headers
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type') && !init.body?.toString().includes('FormData')) {
    headers.set('Content-Type', 'application/json')
  }

  try {
    const response = await fetch(url, {
      ...init,
      headers
    })

    if (!response.ok) {
      throw new HttpError(response.status, response.statusText)
    }

    // Parse JSON response
    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof HttpError) {
      throw error
    }
    throw new Error('Network error')
  }
}

export default fetchApi
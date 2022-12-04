import { TimelineSegmentDate } from '../src'

const API_KEY =
  import.meta.env.API_KEY ||
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic29mdGxpbmUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJhZG1pbiIsInVpZCI6IjYyNDMzZTM4NTUxZjE0NmRhOGFlZDFmMSIsInNpZCI6IjYzOGM4MzlmOTY3ZTdhNzJkZWM0N2U3ZSIsIm5iZiI6MTY3MDE1MzExOSwiZXhwIjoxNjcwMjM5NTE5LCJpc3MiOiJtYXBtYWtlcnMuaHlkcm8iLCJhdWQiOiJ3ZWIifQ.nbh0W8tUh7gJ9Gi1uAKQ7vzwogfdyX5OHDPy00diPjU`

export async function requestData<T>(
  url: string,
  from: TimelineSegmentDate,
  to: TimelineSegmentDate
): Promise<T> {
  const response = await fetch(`${url}?dtFrom=${from}&dtTo=${to}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  })

  return response.json()
}

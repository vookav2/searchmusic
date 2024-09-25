import got, { Headers, Options } from 'got'

const httpHeaders: Headers = {
  origin: 'https://music.youtube.com',
  'User-Agent':
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Accept-Language': 'en',
  referer: 'https://music.youtube.com/',
}
const searchParams = new URLSearchParams([
  ['alt', 'json'],
  ['key', 'AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30'],
])
const httpOptions: Options = {
  method: 'POST',
  prefixUrl: 'https://music.youtube.com/youtubei/v1/',
  headers: httpHeaders,
  responseType: 'json',
  resolveBodyOnly: true,
  searchParams,
}
const bodyContext = {
  capabilities: {},
  client: {
    clientName: 'WEB_REMIX',
    clientVersion: '1.20240918.01.00',
    hl: 'en',
    gl: 'US',
  },
}

const httpClient = got.extend(httpOptions)
export const ytRequest = (path: string, body: Record<string, any>) => {
  Object.assign(body, { context: bodyContext })
  return httpClient<unknown>(path, {
    json: body,
  })
}

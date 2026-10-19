const isGoogleDomain = (hostname) => /^([a-z0-9-]+\.)*google\.[a-z.]+$/i.test(hostname)

export const normaliseGoogleMapsUrl = (value) => {
  if (!value?.trim()) return ''

  try {
    const url = new URL(value.trim())
    const hostname = url.hostname.toLowerCase()
    const isGoogleMapsHost = hostname === 'maps.app.goo.gl' || hostname === 'goo.gl' && url.pathname.startsWith('/maps') || hostname.startsWith('maps.') && isGoogleDomain(hostname)
    const isGoogleMapsPath = isGoogleDomain(hostname) && url.pathname.startsWith('/maps')

    if (url.protocol !== 'https:' || (!isGoogleMapsHost && !isGoogleMapsPath)) return ''
    return url.toString()
  } catch {
    return ''
  }
}

export const isGoogleMapsUrl = (value) => Boolean(normaliseGoogleMapsUrl(value))

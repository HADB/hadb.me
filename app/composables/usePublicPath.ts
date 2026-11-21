export function usePublicPath() {
  const basePath = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
  return (path: `/${string}`) => `${basePath}${path}`
}

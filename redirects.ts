// 支持在 generate 阶段生成重定向配置，为了在免费版 CloudFlare Pages 上实现重定向功能

const redirects: { [path: string]: { redirect: { to: string, statusCode?: number } } } = {
  '/page/2': { redirect: { to: '/archives', statusCode: 301 } },
}

for (const [_path, config] of Object.entries(redirects)) {
  if (config.redirect?.to) {
    config.redirect.to = encodeURI(config.redirect.to)
  }
}

export default redirects

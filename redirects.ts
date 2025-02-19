// 支持在 generate 阶段生成重定向配置，为了在免费版 CloudFlare Pages 上实现重定向功能

const redirects: { [path: string]: { redirect: { to: string, statusCode?: number } } } = {
  '/posts/display-deepseek-r1-thinking': { redirect: { to: '/posts/article/2025/display-deepseek-r1-thinking', statusCode: 301 } },
  '/posts/article/2025/display-deepseek-r1-thinking': { redirect: { to: '/posts/article/2025/display-deepseek-r1-thinking', statusCode: 301 } },
  '/posts/article/2021/fastboot-failed-remote-operation-not-permitted': { redirect: { to: '/posts/article/2021/fastboot-failed-remote-operation-not-permitted', statusCode: 301 } },
  '/posts/article/2016/bad-request-invalid-hostname': { redirect: { to: '/posts/article/2016/bad-request-invalid-hostname', statusCode: 301 } },
  '/posts/article/2025/deploy-deepseek-r1-for-free': { redirect: { to: '/posts/article/2025/deploy-deepseek-r1-for-free', statusCode: 301 } },
  '/posts/article/2021/synology-letsencrypt-multiple-domain-cert-configuration': { redirect: { to: '/posts/article/2021/synology-letsencrypt-multiple-domain-cert-configuration', statusCode: 301 } },
  '/posts/article/2020/k8s-cert-manager-tls': { redirect: { to: '/posts/article/2020/k8s-cert-manager-tls', statusCode: 301 } },
  '/posts/article/2024/how-to-delete-web-service-of-synology-dsm-7-2': { redirect: { to: '/posts/article/2024/how-to-delete-web-service-of-synology-dsm-7-2', statusCode: 301 } },
  '/posts/article/2019/solve-pycharm-adding-pipenv-error': { redirect: { to: '/posts/article/2019/solve-pycharm-adding-pipenv-error', statusCode: 301 } },
  '/posts/article/2020/android-webview-picture-cache': { redirect: { to: '/posts/article/2020/android-webview-picture-cache', statusCode: 301 } },
  '/posts/article/2024/get-video-rotation-by-mp4box-js': { redirect: { to: '/posts/article/2024/get-video-rotation-by-mp4box-js', statusCode: 301 } },
  '/posts/article/2015/change-domain-in-weixin': { redirect: { to: '/posts/article/2015/change-domain-in-weixin', statusCode: 301 } },
  '/posts/article/2020/batch-edit-acl-for-oss': { redirect: { to: '/posts/article/2020/batch-edit-acl-for-oss', statusCode: 301 } },
  '/posts/article/2016/aliyun-cdn-not-support-sni': { redirect: { to: '/posts/article/2016/aliyun-cdn-not-support-sni', statusCode: 301 } },
  '/posts/article/2019/centos-wire-ieee8021x-config': { redirect: { to: '/posts/article/2019/centos-wire-ieee8021x-config', statusCode: 301 } },
  '/posts/article/2023/shanghai-luohu': { redirect: { to: '/posts/article/2023/shanghai-luohu', statusCode: 301 } },
  '/posts/article/2024/slice-of-mind-20240801': { redirect: { to: '/posts/article/2024/slice-of-mind-20240801', statusCode: 301 } },
  '/posts/article/2018/windows-storage-spaces-raid1-degraded': { redirect: { to: '/posts/article/2018/windows-storage-spaces-raid1-degraded', statusCode: 301 } },
  '/posts/article/2012/snaps-to-device-pixels': { redirect: { to: '/posts/article/2012/snaps-to-device-pixels', statusCode: 301 } },
  '/posts/article/2024/diary-20240611': { redirect: { to: '/posts/article/2024/diary-20240611', statusCode: 301 } },
  '/posts/article/2024/switch-blog-from-ghost-to-nuxt-content': { redirect: { to: '/posts/article/2024/switch-blog-from-ghost-to-nuxt-content', statusCode: 301 } },
  '/posts/article/2024/managing-containers-in-my-homelab': { redirect: { to: '/posts/article/2024/managing-containers-in-my-homelab', statusCode: 301 } },
  '/posts/article/2019/docker-registry-auth-with-same-domain': { redirect: { to: '/posts/article/2019/docker-registry-auth-with-same-domain', statusCode: 301 } },
  '/posts/article/2024/guide-for-beginners': { redirect: { to: '/posts/article/2024/guide-for-beginners', statusCode: 301 } },
  '/posts/article/2023/gitlab-ci-auto-deploy-python-lib': { redirect: { to: '/posts/article/2023/gitlab-ci-auto-deploy-python-lib', statusCode: 301 } },
  '/posts/article/2012/sqlite-error-no-such-table': { redirect: { to: '/posts/article/2012/sqlite-error-no-such-table', statusCode: 301 } },
  '/posts/article/2019/audiowave-animation': { redirect: { to: '/posts/article/2019/audiowave-animation', statusCode: 301 } },
  '/posts/article/2020/how-to-become-a-fullstack-developer': { redirect: { to: '/posts/article/2020/how-to-become-a-fullstack-developer', statusCode: 301 } },
  '/posts/article/2025/end-of-2024': { redirect: { to: '/posts/article/2025/end-of-2024', statusCode: 301 } },
  '/posts/article/2020/devops-gitlab-ci-aliyun-k8s': { redirect: { to: '/posts/article/2020/devops-gitlab-ci-aliyun-k8s', statusCode: 301 } },
  '/posts/article/2024/thoughts-about-ai': { redirect: { to: '/posts/article/2024/thoughts-about-ai', statusCode: 301 } },
}

for (const [_path, config] of Object.entries(redirects)) {
  if (config.redirect?.to) {
    config.redirect.to = encodeURI(config.redirect.to)
  }
}

export default redirects

<p align="center">
  <img width="180px" src="https://raw.githubusercontent.com/HADB/hadb.me/main/public/favicon/favicon.svg" />
</p>

## [hadb.me](https://hadb.me)

我的个人网站（第 4 代）

[Atom 全文订阅](https://hadb.me/atom.xml) · [站点地图](https://hadb.me/sitemap_index.xml)

### 本地开发

Node.js 版本见 [`.nvmrc`](.nvmrc)，pnpm 版本见 [`package.json`](package.json) 的 `packageManager`。

```sh
nvm install
npm install --global "$(node -p 'require("./package.json").packageManager')"
pnpm install --frozen-lockfile
pnpm dev
```

文章在 [`content/posts/`](content/posts/)，动态在 [`content/moments/`](content/moments/)，独立页面在 [`content/`](content/) 根目录。

### 构建与部署

运行 `NITRO_PRESET=github_pages pnpm generate` 生成静态站点，产物位于 `.output/public/`。

合并到 `main` 后，GitHub Actions 会构建并发布到 GitHub Pages。面向 `main` 的 PR 会运行静态构建，并检查首页、文章列表、抽样文章和 Atom feed 的 HTTP 状态与内容。 [部署记录](https://github.com/HADB/hadb.me/actions/workflows/github-pages.yml)

### 博客框架折腾历史

- 2012年（第 1 代）：[WordPress](https://wordpress.org/)
- 2015年（第 2 代）：[Hexo](https://hexo.io/)
- 2017年（第 3 代）：[Ghost](https://ghost.org/)
- 2024年（第 4 代）：[Nuxt Content](https://content.nuxt.com/)

### 许可协议

- 博客代码：[MIT](https://github.com/HADB/hadb.me/blob/main/LICENSE)
- 文章、图片：[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)

### Checklist

- [x] 支持标签搜索
- [x] 生成 Sitemap 和 Atom 全文订阅
- [x] 导入全部历史文章
- [x] 接入评论系统
- [x] 从 Cloudflare Pages 迁移到 GitHub Pages
- [x] 接入 Plausible
- [x] 导入 Disqus 评论至 Artalk
- [x] 导入 Google Analytics PV 数据至 Artalk
- [x] 升级到 Nuxt 4 和 Nuxt Content 3

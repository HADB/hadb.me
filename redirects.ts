import fs from 'node:fs'
import path from 'node:path'

const postsDirectory = path.join(__dirname, 'content/posts')
const redirects: { [path: string]: { redirect: { to: string, statusCode?: number } } } = {
  '/archives': { redirect: { to: '/posts', statusCode: 301 } },
}

// 获取目录下所有的 .md 文件
const getPostFiles = (dir: string): string[] => {
  let files: string[] = []

  const items = fs.readdirSync(dir)
  items.forEach((item) => {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      files = files.concat(getPostFiles(fullPath))
    }
    else if (fullPath.endsWith('.md')) {
      files.push(fullPath)
    }
  })

  return files
}

// 遍历目录下的文件生成重定向规则
getPostFiles(postsDirectory).forEach((filePath) => {
  const fileName = path.basename(filePath).replace(/^\d{8}\./, '').replace('.md', '')
  const year = path.basename(path.dirname(filePath))
  const pathUrl = `/posts/${year}/${fileName}`

  redirects[`/posts/${fileName}`] = {
    redirect: { to: encodeURI(pathUrl), statusCode: 301 },
  }
  redirects[`/posts/article/${year}/${fileName}`] = {
    redirect: { to: encodeURI(pathUrl), statusCode: 301 },
  }
})

export default redirects

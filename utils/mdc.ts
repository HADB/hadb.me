import type { MarkdownRoot, MinimalElement, MinimalNode, MinimalTree } from '@nuxt/content'
import type { MDCComment, MDCElement, MDCNode, MDCRoot, MDCText } from '@nuxtjs/mdc'

export function compressTree(input: MDCRoot): MinimalTree {
  return {
    type: 'minimal',
    value: input.children.map(compressNode).filter((v) => v !== undefined) as MinimalNode[],
  }
}

export function decompressTree(tree: MinimalTree, stem: string): MDCRoot {
  return {
    type: 'root',
    children: tree.value.map((node) => decompressNode(node, stem)),
  }
}

function decompressNode(node: MinimalNode, stem: string): MDCElement | MDCText {
  if (typeof node === 'string') {
    return {
      type: 'text',
      value: node,
    }
  }

  const [tag, props, ...children] = node as MinimalElement
  if (![
    'a',
    'blockquote',
    'br',
    'code',
    'del',
    'em',
    'figcaption',
    'figure',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'i',
    'img',
    'input',
    'li',
    'ol',
    'p',
    'pre',
    'span',
    'strong',
    'style',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'u',
    'ul',
    'email',
    'iframe',
    'post-image',
    'reward-code',
    'scrollable-table',
    'video-player',
  ].includes(tag)) {
    console.warn('Unknown tag:', tag)
  }

  let resultTag = tag
  let resultProps = props
  let resultChildren = children

  if (tag === 'video-player') {
    resultTag = 'video'
    resultProps = {
      src: `/static/${stem}/${props.filename}`,
      autoplay: props.autoplay,
      controls: props.controls,
      loop: props.loop,
    }
  }
  else if (tag === 'post-image') {
    resultTag = 'figure'
    resultProps = {}
    resultChildren = [
      [
        'img',
        {
          src: `/static/${stem}/${props.filename}`,
          alt: props.description,
        },
      ],
    ]
    if (props.description) {
      resultChildren.push([
        'figcaption',
        {},
        props.description as string,
      ])
    }
  }
  else if (tag === 'scrollable-table' && children.length === 1) {
    return decompressNode(children[0], stem)
  }
  else if (tag === 'iframe') {
    resultTag = 'a'
    resultProps = {
      href: props.src,
      target: '_blank',
      rel: 'noopener noreferrer',
    }
    resultChildren = [
      '点击查看',
    ]
  }
  else if (tag === 'email') {
    resultTag = 'a'
    resultProps = {
      href: `mailto:${props.email}`,
      target: '_blank',
      rel: 'noopener noreferrer',
    }
    resultChildren = [
      props.email as string,
    ]
  }
  else if (tag === 'reward-code') {
    resultTag = 'img'
    resultProps = {
      src: `/static/reward-code.jpg`,
      alt: '赞赏码',
    }
  }

  return {
    type: 'element',
    tag: resultTag,
    props: resultProps,
    children: resultChildren.map((child) => decompressNode(child, stem)),
  }
}

function compressNode(input: MDCElement | MDCText | MDCComment): MinimalNode | undefined {
  if (input.type === 'comment') {
    return undefined
  }
  if (input.type === 'text') {
    return input.value
  }

  // remove empty class
  if (input.tag === 'code' && input.props?.className && input.props.className.length === 0) {
    delete input.props.className
  }

  return [
    input.tag,
    input.props || {},
    ...input.children.map(compressNode).filter((v) => v !== undefined),
  ]
}

export function extractContent(
  node: MDCRoot | MDCNode | MDCNode[] | null,
): string {
  if (!node) {
    return ''
  }

  if (typeof node === 'string') {
    return node
  }

  if (Array.isArray(node)) {
    return node.map(extractContent).join('')
  }

  else if (node.type === 'root') {
    return node.children.map(extractContent).join('')
  }

  else if (node.type === 'element') {
    // 忽略 style 标签
    if (node.tag === 'style') {
      return ''
    }

    let attributes = ''
    if (node.props && node.tag !== 'pre' && node.tag !== 'code') {
      attributes = Object.entries(node.props)
        .filter(([key]) => !['style'].includes(key))
        .filter(([_, value]) => value !== undefined && value !== null && value !== '' && value !== false)
        .map(([key, value]) => {
          if (value === true) {
            return key
          }
          return `${key}="${value}"`
        })
        .join(' ')

      if (attributes) {
        attributes = ` ${attributes}`
      }
    }

    const content = extractContent(node.children)

    return `<${node.tag}${attributes}>${content}</${node.tag}>`
  }
  else if (node.type === 'text') {
    return node.value
  }

  return ''
}

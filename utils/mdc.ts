import type { MarkdownRoot, MinimalElement, MinimalNode, MinimalTree } from '@nuxt/content'
import type { MDCComment, MDCElement, MDCNode, MDCRoot, MDCText } from '@nuxtjs/mdc'

export function compressTree(input: MDCRoot): MinimalTree {
  return {
    type: 'minimal',
    value: input.children.map(compressNode).filter((v) => v !== undefined) as MinimalNode[],
  }
}

export function decompressTree(input: MinimalTree): MDCRoot {
  return {
    type: 'root',
    children: input.value.map(decompressNode),
  }
}

function decompressNode(input: MinimalNode): MDCElement | MDCText {
  if (typeof input === 'string') {
    return {
      type: 'text',
      value: input,
    }
  }

  const [tag, props, ...children] = input as MinimalElement
  return {
    type: 'element',
    tag,
    props,
    children: children.map(decompressNode),
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
        .map(([key, value]) => `${key}="${value}"`)
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

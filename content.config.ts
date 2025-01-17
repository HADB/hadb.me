import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: '*.md',
      schema: z.object({
        hideComments: z.boolean().optional(),
      }),
    }),
    posts: defineCollection({
      type: 'page',
      source: 'posts/*.md',
      schema: z.object({
        class: z.string().optional(),
        cover: z.string().optional(),
        coverSize: z.object({ width: z.number(), height: z.number() }).optional(),
        date: z.string(),
        draft: z.boolean().optional(),
        hideComments: z.boolean().optional(),
        readingTime: z.object({}),
        tags: z.array(z.string()),
        time: z.string().optional(),
      }),
    }),
  },
})

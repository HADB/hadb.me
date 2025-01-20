import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: '*.md',
        schema: z.object({
          description: z.string().optional(),
          hideComments: z.boolean().optional(),
          layout: z.enum(['default', 'full-width']).optional(),
          readingTime: z.object({}),
        }),
      }),
    ),
    posts: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'posts/*.md',
        schema: z.object({
          class: z.string().optional(),
          cover: z.string().optional(),
          coverSize: z.object({ width: z.number(), height: z.number() }).optional(),
          date: z.string(),
          description: z.string().optional(),
          draft: z.boolean().optional(),
          hideComments: z.boolean().optional(),
          location: z.string().optional(),
          readingTime: z.object({}),
          tags: z.array(z.string()),
          time: z.string().optional(),
          weather: z.string().optional(),
        }),
      }),
    ),
  },
})

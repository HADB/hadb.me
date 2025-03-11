import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'

const readingTimeSchema = z.object({
  minutes: z.number(),
  text: z.string(),
  time: z.number(),
  words: z.number(),
})

export default defineContentConfig({
  collections: {
    pages: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: '*.md',
        schema: z.object({
          description: z.string().optional(),
          hideComments: z.boolean().default(false),
          layout: z.enum(['default', 'full-width']).default('default'),
          readingTime: readingTimeSchema,
        }),
      }),
    ),
    posts: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'posts/**/*.md',
        schema: z.object({
          class: z.string().optional(),
          cover: z.string().optional(),
          coverSize: z.object({ width: z.number(), height: z.number() }).optional(),
          date: z.string(),
          description: z.string().optional(),
          draft: z.boolean().default(false),
          hideComments: z.boolean().default(false),
          location: z.string().optional(),
          readingTime: readingTimeSchema,
          tags: z.array(z.string()),
          time: z.string().optional(),
          weather: z.string().optional(),
        }),
      }),
    ),
    moments: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'moments/**/*.md',
        schema: z.object({
          datetime: z.string(),
          location: z.string().optional(),
          tags: z.array(z.string()),
          content: z.string(),
          media: z.array(z.object({
            type: z.enum(['image', 'video']),
            filename: z.string().optional(),
            id: z.string().optional(),
            poster: z.string().optional(),
            duration: z.number().optional(),
          })),
        }),
      }),
    ),
  },
})

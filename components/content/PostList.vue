<script lang="ts" setup>
import type { QueryBuilderParams } from '@nuxt/content'

interface Props {
  year?: number
  tag?: string
  limit?: number
  skip?: number
}

const props = withDefaults(defineProps<Props>(), {
  year: undefined,
  tag: undefined,
  limit: undefined,
  skip: 0,
})

const query: QueryBuilderParams = {
  path: '/posts',
  where: [
    {
      date: {
        $exists: true,
        $contains: props.year,
      },
    },
    {
      tags: {
        $contains: props.tag,
      },
    },
  ],
  sort: [
    { _path: -1 },
    { date: -1 },
  ],
  skip: props.skip,
  limit: props.limit,
}
</script>

<template>
  <div class="post-list">
    <div class="posts">
      <ContentList :query="query">
        <template #default="{ list }">
          <ul class="list-none ps-0">
            <li v-for="post in list" :key="post._path" class="ps-0 my-4 flex">
              <span class="mr-4 text-sm text-slate-500 font-mono flex-shrink-0 leading-6">
                {{ formatDateTime(post.date, 'yyyy-MM-dd') }}
              </span>
              <div class="leading-6 truncate">
                <NuxtLink :to="post._path">
                  {{ post.title }}
                </NuxtLink>
              </div>
            </li>
          </ul>
        </template>
        <template #not-found>
          <p>没有找到文章</p>
        </template>
      </ContentList>
    </div>
  </div>
</template>

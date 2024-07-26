<script lang="ts" setup>
import type { QueryBuilderParams } from '@nuxt/content'

const props = defineProps({
  year: {
    type: Number,
    required: false,
  },
  limit: {
    type: Number,
    default: undefined,
  },
  skip: {
    type: Number,
    default: 0,
  },
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
  ],
  limit: props.limit,
  skip: props.skip,
  sort: {
    date: -1,
  },
}
</script>

<template>
  <div class="post-list">
    <div class="posts">
      <ContentList v-slot="{ list }" :query="query">
        <ul class="list-none ps-0">
          <li v-for="post in list" :key="post._path" class="ps-0">
            <span class="mr-4 text-sm text-slate-500">{{ formatDateTime(post.date, 'yyyy-MM-dd') }}</span>
            <a :href="post._path">
              <span>{{ post.title }}</span>
            </a>
          </li>
        </ul>
      </ContentList>
    </div>
  </div>
</template>

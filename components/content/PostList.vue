<script lang="ts" setup>
import type { QueryBuilderParams } from '@nuxt/content'

const props = defineProps({
  year: {
    type: Number,
    required: false,
  },
})

const query: QueryBuilderParams = {
  path: '/posts',
  where: [
    {
      date: {
        $contains: props.year,
      },
    },
  ],
}
</script>

<template>
  <div class="post-list">
    <div class="posts">
      <ContentList v-slot="{ list }" :query="query">
        <ul>
          <li v-for="article in list" :key="article._path">
            <a :href="article._path">{{ article.title }}</a>
          </li>
        </ul>
      </ContentList>
    </div>
  </div>
</template>

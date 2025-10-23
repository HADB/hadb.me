<script lang="ts" setup>
interface Props {
  year?: number
  tag?: string
  limit?: number
  skip?: number
}

const props = withDefaults(defineProps<Props>(), {
  year: undefined,
  tag: undefined,
  limit: 999,
  skip: 0,
})

const { data: posts } = await useAsyncData(`posts-${props.year}-${props.tag}-${props.skip}-${props.limit}`, () => {
  let query = queryCollection('posts').where('draft', '=', false)
  if (props.year) {
    query = query.where('date', 'LIKE', `${props.year}-%`)
  }
  if (props.tag) {
    query = query.where('tags', 'LIKE', `%${props.tag}%`)
  }
  return query
    .order('date', 'DESC')
    .skip(props.skip)
    .limit(props.limit)
    .all()
})
</script>

<template>
  <div class="post-list">
    <div class="posts">
      <ul class="list-none ps-0">
        <li v-for="post in posts" :key="post.path" class="ps-0 mt-4 mb-4 flex">
          <span class="mr-4 text-sm text-slate-500 font-mono shrink-0 leading-6">
            {{ formatDateTime(post.date, 'yyyy-MM-dd') }}
          </span>
          <div class="leading-6 truncate">
            <NuxtLink :to="post.path">
              {{ post.title }}
            </NuxtLink>
          </div>
        </li>
      </ul>

      <template v-if="!posts?.length">
        <p>没有找到文章</p>
      </template>
    </div>
  </div>
</template>

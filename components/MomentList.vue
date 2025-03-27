<script lang="ts" setup>
interface Props {
  tag?: string
  limit?: number
  skip?: number
}

const props = withDefaults(defineProps<Props>(), {
  tag: undefined,
  limit: 999,
  skip: 0,
})

const { data: moments } = await useAsyncData(`moments-${props.tag}-${props.skip}-${props.limit}`, () => {
  let query = queryCollection('moments')
  if (props.tag) {
    query = query.where('tags', 'LIKE', `%${props.tag}%`)
  }
  return query
    .order('datetime', 'DESC')
    .skip(props.skip)
    .limit(props.limit)
    .all()
})
</script>

<template>
  <div class="post-list">
    <div class="moments">
      <div v-for="moment in moments" :key="moment.path" class="p-4 mt-4 mb-4 border rounded-lg border-slate-200 dark:border-slate-700 flex flex-col gap-2">
        <div class="text-slate-500 text-sm leading-6">
          {{ formatDateTime(moment.datetime, 'yyyy 年 MM 月 dd 日 HH:mm') }}
        </div>
        <MomentContent :moment="moment" />
        <div class="flex flex-wrap items-center gap-x-2 text-sm leading-6">
          <NuxtLink v-for="tag in moment.tags" :key="tag" :to="`/moments/tag/${encodeTag(tag)}`" class="border-b-0!">
            <span class="text-slate-500">#</span> {{ tag }}
          </NuxtLink>
        </div>
      </div>

      <template v-if="!moments?.length">
        <p>没有找到动态</p>
      </template>
    </div>
  </div>
</template>

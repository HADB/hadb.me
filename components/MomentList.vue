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
      <div v-for="moment in moments" :key="moment.path" class="px-4 py-4 my-4 border rounded-lg border-slate-200 dark:border-slate-700 flex flex-col">
        <span class="mr-4 text-sm text-slate-500 flex-shrink-0 leading-6">
          {{ formatDateTime(moment.datetime, 'yyyy 年 MM 月 dd 日 HH:mm') }}
        </span>
        <MomentContent :moment="moment" />
      </div>

      <template v-if="!moments?.length">
        <p>没有找到动态</p>
      </template>
    </div>
  </div>
</template>

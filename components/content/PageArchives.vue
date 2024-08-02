<script lang="ts" setup>
const startYear = 2010
const currentYear = new Date().getFullYear()
const years: number[] = []
const { data: post_dates } = await useAsyncData(`post_dates`, () => queryContent('posts').where({ date: { $exists: true } }).only(['date']).find())

for (let year = currentYear; year >= startYear; year--) {
  if (post_dates.value?.filter((date: any) => date.date.includes(year)).length) {
    years.push(year)
  }
}
</script>

<template>
  <div class="page-archives">
    <TagList />
    <div class="years">
      <div v-for="year in years" :key="year">
        <h3>{{ year }} 年</h3>
        <PostList :year="year" />
      </div>
    </div>
  </div>
</template>

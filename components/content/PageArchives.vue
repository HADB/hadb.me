<script lang="ts" setup>
const startYear = 2010
const currentYear = new Date().getFullYear()
const years: number[] = []
for (let year = currentYear; year >= startYear; year--) {
  const posts_count = await queryContent('posts').where({ date: {
    $contains: year,
  } }).count()
  if (posts_count > 0) {
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

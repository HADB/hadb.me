<script lang="ts" setup>
useSeoMeta({
  title: 'HADB.ME',
  description: 'HADB 的个人网站',
})
</script>

<template>
  <NuxtLayout name="full-width">
    <h2>首页</h2>
    <p>Hello，欢迎光临我的个人网站！我从 2012 年开始写博客，运营至今。</p>
    <p>我会在这里持续记录个人经历、经验和思考，希望能给你带来收获。</p>
    <p>PS: 目前正在计划从 Ghost 迁移至 Nuxt Content，正在重新打造博客系统</p>

    <h3>最新文章</h3>
    <PostList :limit="3" />
  </NuxtLayout>
</template>

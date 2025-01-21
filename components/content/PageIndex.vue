<template>
  <slot />
  <h2>最新文章</h2>
  <PostList :limit="10" />
</template>

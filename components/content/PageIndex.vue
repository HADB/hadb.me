<template>
  <div>
    <slot :use="$slots.content" />
  </div>
  <h2>最新文章</h2>
  <PostList :limit="10" />
</template>

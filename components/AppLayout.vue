<script setup lang="ts">
const { cover } = useAppConfig()
</script>

<template>
  <div class="py-4">
    <Html lang="en" />
    <Meta property="og:image" :content="cover" />
    <Meta name="twitter:card" content="summary_large_image" />
    <NuxtLoadingIndicator />
    <AppNavbar />
    <slot />
  </div>
</template>

<style lang="postcss">
body {
  @apply bg-gray-50 text-black dark:bg-gray-900 dark:text-white;
}
</style>

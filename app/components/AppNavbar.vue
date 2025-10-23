<script lang="ts" setup>
const { data: navigation } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('pages')
})
</script>

<template>
  <div class="app-navbar px-4 sm:px-12">
    <div class="flex justify-between items-center max-w-7xl mx-auto flex-wrap">
      <NuxtLink to="/">
        <AppLogo class="w-24 sm:w-32" />
      </NuxtLink>
      <div class="flex justify-center items-center order-last sm:order-none w-full sm:w-auto pt-2 sm:pt-0 space-x-6">
        <ButtonLink
          v-for="link of navigation"
          :key="link.path"
          :to="link.path"
        >
          {{ link.title }}
        </ButtonLink>
      </div>
      <div class="sm:w-32 flex justify-end items-center space-x-1">
        <ButtonLink to="https://github.com/HADB" tooltip="GitHub" icon="fa6-brands:github" external target="_blank" />
        <ButtonLink to="https://hadb.me/atom.xml" tooltip="Feed 订阅" icon="fa6-solid:square-rss" external target="_blank" />
        <ColorModeSwitch />
      </div>
    </div>
  </div>
</template>

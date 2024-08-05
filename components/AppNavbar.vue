<script lang="ts" setup>
const { navigation } = useContent()
</script>

<template>
  <div class="app-navbar px-4 sm:px-12">
    <div class="flex justify-between items-center max-w-7xl mx-auto flex-wrap">
      <NuxtLink to="/">
        <AppLogo class="w-24 sm:w-32" />
      </NuxtLink>
      <div class="flex justify-center items-center order-last sm:order-none w-full sm:w-auto pt-2 sm:pt-0 space-x-6 overflow-x-auto">
        <NuxtLink
          v-for="link of navigation"
          :key="link._path"
          :to="link._path"
          active-class="text-primary-500"
          class="font-medium text-md hover:text-primary-600 dark:hover:text-primary-400 sm:text-lg shrink-0"
        >
          {{ link.title }}
        </NuxtLink>
      </div>
      <div class="w-32 flex justify-end items-center space-x-3 transition">
        <a href="https://x.com/beandeng" target="_blank" title="X" class="w-5 h-5">
          <Icon name="fa6-brands:x-twitter" class="w-5 h-5" />
        </a>
        <a href="https://github.com/HADB" target="_blank" title="GitHub" class="w-5 h-5">
          <Icon name="fa6-brands:github" class="w-5 h-5" />
        </a>
        <ColorModeSwitch />
      </div>
    </div>
  </div>
</template>

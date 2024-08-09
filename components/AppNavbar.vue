<script lang="ts" setup>
const { navigation } = useContent()
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
          :key="link._path"
          :href="link._path"
        >
          {{ link.title }}
        </ButtonLink>
      </div>
      <div class="sm:w-32 flex justify-end items-center space-x-1">
        <ButtonLink href="https://x.com/beandeng" tooltip="Twitter" icon="fa6-brands:x-twitter" external />
        <ButtonLink href="https://github.com/HADB" tooltip="GitHub" icon="fa6-brands:github" external />
        <ButtonLink href="https://hadb.me/atom.xml" tooltip="Feed 订阅" icon="fa6-solid:square-rss" external />
        <ColorModeSwitch />
      </div>
    </div>
  </div>
</template>

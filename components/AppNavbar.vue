<script lang="ts" setup>
const { navigation } = useContent()
// console.log(navigation.value)
const appConfig = useAppConfig()
</script>

<template>
  <div class="flex justify-between max-w-7xl py-4 mx-auto mb-4 px-4 md:px-8">
    <div class="text-gray-700 dark:text-gray-200">
      <NuxtLink to="/" class="mr-6">
        HADB.ME
      </NuxtLink>
      <NuxtLink
        v-for="link of navigation"
        :key="link._path"
        :to="link._path"
        active-class="font-bold"
        class="mr-6"
      >
        {{ link.title }}
      </NuxtLink>
    </div>
    <div class="space-x-3 transition text-gray-500">
      <a v-if="appConfig.socials?.x" :href="`https://x.com/${appConfig.socials?.x}`" title="X" class="dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300">
        <Icon name="fa6-brands:x-twitter" class="w-5 h-5" />
      </a>
      <a v-if="appConfig.socials?.github" :href="`https://github.com/${appConfig.socials?.github}`" title="GitHub" class="dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300">
        <Icon name="fa6-brands:github" class="w-5 h-5" />
      </a>
      <ColorModeSwitch class="dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300" />
    </div>
  </div>
</template>

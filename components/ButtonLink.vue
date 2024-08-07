<script lang="ts" setup>
interface Props {
  href?: string
  external?: boolean
  icon?: string
}

withDefaults(defineProps<Props>(), {
  href: '',
  external: false,
  icon: '',
})
</script>

<template>
  <span class="not-prose">
    <NuxtLink
      :to="href"
      :external="external"
      active-class="bg-slate-100 dark:bg-slate-700/30 outline"
      class="inline-flex items-center font-medium text-base leading-4 sm:text-lg sm:leading-7 gap-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/30 p-2 rounded no-underline hover:outline outline-1 outline-slate-200 dark:outline-slate-700 shrink-0"
    >
      <template v-if="icon">
        <Icon :name="icon" class="w-5 h-5" />
        <ContentSlot :use="$slots.default" unwrap="p" />
      </template>
      <span v-else class="px-2">
        <ContentSlot :use="$slots.default" unwrap="p" />
      </span>
    </NuxtLink>
  </span>
</template>

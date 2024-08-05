<script setup>
defineProps({
  href: {
    type: String,
    required: false,
  },
  external: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <span class="not-prose">
    <NuxtLink
      :to="href"
      :external="external"
      active-class="bg-slate-200 dark:bg-slate-800"
      class="inline-flex items-center font-medium text-base leading-4 sm:text-lg sm:leading-7 gap-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 p-2 rounded no-underline shrink-0"
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

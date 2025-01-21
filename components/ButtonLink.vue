<script lang="ts" setup>
interface Props {
  to?: string
  external?: boolean
  icon?: string
  tooltip?: string
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & {}) | null
}

withDefaults(defineProps<Props>(), {
  to: '',
  external: false,
  icon: '',
})
</script>

<template>
  <span class="not-prose">
    <UTooltip :prevent="!tooltip" :text="tooltip" :popper="{ arrow: true }">
      <NuxtLink
        :to="to"
        :external="external"
        :target="target"
        active-class="bg-slate-100 dark:bg-slate-700/30 outline"
        class="inline-flex items-center font-medium text-base leading-4 sm:text-lg sm:leading-7 gap-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/30 p-2 rounded no-underline hover:outline outline-1 outline-slate-200 dark:outline-slate-700 shrink-0"
      >
        <template v-if="icon">
          <Icon :name="icon" class="w-5 h-5" />
          <slot />
        </template>
        <span v-else class="px-2">
          <slot />
        </span>
      </NuxtLink>
    </UTooltip>
  </span>
</template>

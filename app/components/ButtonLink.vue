<script lang="ts" setup>
import { NuxtLink } from '#components'

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
      <component
        :is="to ? NuxtLink : 'button'"
        v-bind="to
          ? { to, external, target, exactActiveClass: 'bg-slate-100 dark:bg-slate-700/30 outline' }
          : { 'type': 'button', 'aria-label': tooltip }"
        class="inline-flex items-center font-medium text-base leading-4 sm:text-lg sm:leading-7 gap-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/30 p-2 rounded-sm no-underline hover:outline outline-slate-200 dark:outline-slate-700 shrink-0"
      >
        <template v-if="icon">
          <UIcon :name="icon" class="w-5 h-5" />
          <slot />
        </template>
        <span v-else class="px-2">
          <slot />
        </span>
      </component>
    </UTooltip>
  </span>
</template>

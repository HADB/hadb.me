<script setup lang="ts">
const colorMode = useColorMode()
const onClick = () => {
  const values = ['system', 'light', 'dark']
  const index = values.indexOf(colorMode.preference)
  const next = (index + 1) % values.length

  colorMode.preference = values[next]
}
</script>

<template>
  <button aria-label="Color Mode" class="inline-block w-5" @click="onClick">
    <ColorScheme>
      <template v-if="colorMode.preference === 'dark'">
        <Icon name="uil:moon" class="w-5 h-5" />
        <span class="sr-only">Dark mode</span>
      </template>
      <template v-else-if="colorMode.preference === 'light'">
        <Icon name="uil:sun" class="w-5 h-5" />
        <span class="sr-only">Light mode</span>
      </template>
      <template v-else>
        <Icon name="uil:desktop" class="w-5 h-5" />
        <span class="sr-only">System mode</span>
      </template>
    </ColorScheme>
  </button>
</template>

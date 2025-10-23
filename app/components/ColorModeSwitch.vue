<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

const onClick = () => {
  const values = ['light', 'dark']
  const index = values.indexOf(colorMode.value)
  const next = (index + 1) % values.length
  colorMode.preference = values[next]
}
</script>

<template>
  <ColorScheme>
    <ButtonLink
      :icon="isDark ? 'material-symbols:dark-mode-rounded' : 'material-symbols:light-mode-rounded'"
      :tooltip="isDark ? '切换至浅色模式' : '切换至深色模式'"
      @click="onClick"
    />
  </ColorScheme>
</template>

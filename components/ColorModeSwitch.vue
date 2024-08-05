<script setup lang="ts">
const colorMode = useColorMode()

const onClick = () => {
  const values = ['light', 'dark']
  const index = values.indexOf(colorMode.value)
  const next = (index + 1) % values.length
  colorMode.preference = values[next]
}
</script>

<template>
  <ColorScheme>
    <ButtonLink :icon="colorMode.value === 'dark' ? 'material-symbols:dark-mode-rounded' : 'material-symbols:light-mode-rounded' " @click="onClick" />
  </ColorScheme>
</template>

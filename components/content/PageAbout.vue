<template>
  <div class="grid gap-8 grid-cols-1 lg:grid-cols-6">
    <div class="-mt-5 lg:col-span-4">
      <ContentSlot :use="$slots.content" />
    </div>
    <img
      class="m-0 w-full object-cover lg:col-span-2"
      src="/images/about_me.jpg"
      alt="Bean"
    >
  </div>
</template>

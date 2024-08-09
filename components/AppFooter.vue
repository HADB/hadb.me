<template>
  <div class="flex items-center justify-center flex-wrap text-xs sm:text-sm text-slate-500 divided">
    <span>Copyright © 2012-{{ new Date().getFullYear() }} Bean Deng</span>
    <NuxtLink to="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans" class="grid grid-cols-4 gap-1 hover:!border-b-0" external target="_blank">
      <Icon name="fa6-brands:creative-commons" class="w-4 h-4" />
      <Icon name="fa6-brands:creative-commons-by" class="w-4 h-4" />
      <Icon name="fa6-brands:creative-commons-nc" class="w-4 h-4" />
      <Icon name="fa6-brands:creative-commons-sa" class="w-4 h-4" />
    </NuxtLink>
  </div>
</template>

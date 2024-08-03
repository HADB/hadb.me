<template>
  <div class="py-4 sm:py-12">
    <Html lang="en" />
    <Meta property="og:image" content="/favicon.svg" />
    <Meta name="twitter:card" content="summary_large_image" />
    <Link rel="icon" href="/favicon.svg" />
    <NuxtLoadingIndicator />
    <AppNavbar />
    <slot />
    <AppFooter />
  </div>
</template>

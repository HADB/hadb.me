<template>
  <div class="py-4 sm:py-12">
    <Html lang="zh-CN" />
    <Meta property="og:image" content="/favicon-1024x1024.png" />
    <Meta property="og:image:width" content="1024" />
    <Meta property="og:image:height" content="1024" />
    <Meta property="og:image:type" content="image/png" />
    <Meta name="twitter:card" content="summary_large_image" />
    <Link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
    <Link rel="icon" type="image/png" sizes="1024x1024" href="/favicon/favicon-1024x1024.png" />
    <Link rel="icon" type="image/png" sizes="1024x1024" href="/favicon/favicon-1024x1024-dark.png" media="(prefers-color-scheme: dark)" />
    <Link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
    <Link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32-dark.png" media="(prefers-color-scheme: dark)" />
    <Link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
    <Link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16-dark.png" media="(prefers-color-scheme: dark)" />
    <Link rel="manifest" href="/favicon/site.webmanifest" />
    <NuxtLoadingIndicator />
    <AppNavbar />
    <slot />
    <AppFooter />
  </div>
</template>

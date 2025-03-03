<script setup lang="ts">
import IntroductionItem from './IntroductionItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <IntroductionItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Documentation</template>

    Bigbank's
    <a href="https://dragonsofmugloar.com/" target="_blank" rel="noopener">Dragons of Mugloar</a>
    provided me with all information needed to get started.
  </IntroductionItem>

  <IntroductionItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Tooling</template>

    This project is served and bundled with
    <a href="https://vite.dev/guide/features.html" target="_blank" rel="noopener">Vite</a>. The
    recommended IDE setup is
    <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank" rel="noopener">Volar</a>. If
    you need to test components and web pages, check out
    <a href="https://vitest.dev/" target="_blank" rel="noopener">Vitest</a>
    and
    <a href="https://playwright.dev/" target="_blank" rel="noopener">Playwright</a>.

    <br />

    More instructions are available in
    <a href="javascript:void(0)" @click="openReadmeInEditor"><code>README.md</code></a
    >.
  </IntroductionItem>
</template>

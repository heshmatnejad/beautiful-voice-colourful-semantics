<script setup lang="ts">
import BVLogo from './BVLogo.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f0f0f0]" style="font-family: system-ui, sans-serif">
    <header class="bg-[#1e3a28] flex items-center justify-between px-5 py-3 flex-shrink-0">
      <div class="flex items-center gap-4"><BVLogo /><span class="text-white font-bold text-base ml-2">Colourful Semantics</span></div>
      <nav class="flex items-center gap-5 text-sm text-white/80"><span>🏠 Home</span><span>⚙ Settings</span><span>?</span></nav>
    </header>
    <main class="flex-1 overflow-auto"><slot /></main>
  </div>
</template>

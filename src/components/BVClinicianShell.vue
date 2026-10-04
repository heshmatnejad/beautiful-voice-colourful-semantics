<script setup lang="ts">
import BVLogo from './BVLogo.vue'
defineProps<{ subtitle?: string; activeSidebarItem?: string }>()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f0f0f0]" style="font-family: system-ui, sans-serif">
    <header class="bg-[#1e3a28] flex items-center justify-between px-5 py-3 flex-shrink-0">
      <div class="flex items-center gap-5"><BVLogo /><span v-if="subtitle" class="text-white font-semibold text-base">{{ subtitle }}</span></div>
      <nav class="flex items-center gap-5 text-sm text-white/80"><span>☰ Client List</span><span class="font-semibold text-white">◉ Client</span><span>⚙ Settings</span><span>?</span><span>⎋ Sign out</span></nav>
    </header>
    <div class="flex flex-1 overflow-hidden">
      <aside class="w-[86px] bg-white border-r border-gray-200 flex flex-col items-center py-2 gap-1 flex-shrink-0">
        <div v-for="item in sidebarItems" :key="item.id" :class="['w-full flex flex-col items-center justify-center py-3 px-1 gap-1 text-center text-[10px] font-medium', activeSidebarItem === item.id ? 'bg-[#7c3aed] text-white' : 'text-gray-500']">
          <span class="text-lg leading-none">{{ item.icon }}</span><span>{{ item.label }}</span>
        </div>
      </aside>
      <main class="flex-1 overflow-auto"><slot /></main>
    </div>
    <footer class="bg-[#1e3a28] text-white text-xs py-2 px-6 flex justify-between flex-shrink-0"><span>© 2026 BeautifulVoice</span><span class="opacity-70">Platform Info &amp; Manual</span></footer>
  </div>
</template>

<script lang="ts">
const sidebarItems = [
  { id: 'training', label: 'Training', icon: '▦' }, { id: 'assessment', label: 'Assessment', icon: '☑' },
  { id: 'results', label: 'Results', icon: '↑' }, { id: 'case-notes', label: 'Case Notes', icon: '☰' },
  { id: 'clients-view', label: "Client's View", icon: '◨' }, { id: 'goals', label: 'Goals', icon: '⊕' },
]
export default { data: () => ({ sidebarItems }) }
</script>

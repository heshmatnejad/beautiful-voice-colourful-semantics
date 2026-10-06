<script setup lang="ts">
import BVChildShell from '../components/BVChildShell.vue'
import type { SessionConfig } from '../types/session'
defineProps<{ config: SessionConfig }>()
defineEmits<{ start: [] }>()
</script>

<template>
  <BVChildShell>
    <div class="min-h-[calc(100vh-58px)] flex items-center justify-center p-8 bg-gradient-to-b from-purple-50 to-white"><div class="max-w-2xl text-center"><h1 class="text-5xl font-black text-gray-800 mb-3">Colourful Semantics</h1><p class="text-2xl text-gray-500 mb-10 font-medium">Let's build some sentences!</p><div class="flex justify-center gap-4 mb-10"><div class="bg-orange-400 text-white font-black text-2xl px-7 py-4 rounded-2xl">WHO</div><div class="bg-yellow-400 text-white font-black text-2xl px-7 py-4 rounded-2xl">DOING</div><div class="bg-green-500 text-white font-black text-2xl px-7 py-4 rounded-2xl">WHAT</div></div><p class="text-gray-600 mb-5 text-xl">Look at the picture. Choose a card or type your answer.</p><div class="flex flex-wrap justify-center gap-2 mb-6"><span v-for="plan in config.topicPlan" :key="plan.requestedTopic" class="bg-white border border-purple-100 rounded-full px-4 py-2 text-purple-700 font-medium">{{ plan.requestedTopic }}</span></div><div class="flex justify-center gap-3 mb-10"><span v-for="n in config.exerciseCount" :key="n" class="bg-gray-100 rounded-full px-4 py-2 text-gray-600 font-medium">Activity {{ n }}</span></div><button @click="$emit('start')" class="bg-purple-600 hover:bg-purple-700 text-white font-black text-2xl px-16 py-5 rounded-3xl shadow-xl">Start!</button></div></div>
  </BVChildShell>
</template>

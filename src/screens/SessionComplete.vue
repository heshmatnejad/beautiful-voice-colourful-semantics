<script setup lang="ts">
import { computed } from 'vue'
import BVChildShell from '../components/BVChildShell.vue'
import type { SessionResults } from '../types/session'
const props = defineProps<{ results: SessionResults }>()
const emit = defineEmits<{ summary: []; finish: [] }>()
const completed = props.results.exercises.filter(Boolean)
const independentRoles = computed(() => completed.flatMap(exercise => exercise ? [exercise.who, exercise.doing, exercise.what] : []).filter(role => role.wasIndependent).length)
</script>

<template>
  <BVChildShell><div class="min-h-[calc(100vh-58px)] flex items-center justify-center p-6 bg-gradient-to-b from-purple-50 to-white"><div class="max-w-xl w-full text-center"><div class="text-8xl mb-4">🌟</div><h1 class="text-5xl font-black text-gray-800 mb-3">You finished!</h1><p class="text-2xl text-gray-500 mb-8">{{ results.config.completionPraise }}</p><div class="bg-white border-2 border-purple-100 rounded-3xl p-6 mb-8 shadow-sm"><p class="text-2xl font-bold text-purple-700">You completed {{ completed.length }} {{ completed.length === 1 ? 'activity' : 'activities' }}.</p><p class="text-gray-500 mt-2">{{ independentRoles }} parts were completed independently.</p><p v-if="!results.config.showResultsToChild" class="text-gray-500 mt-2">Your therapist will review your results.</p></div><div v-if="results.config.showResultsToChild" class="bg-white border border-gray-200 rounded-3xl p-6 mb-8 shadow-sm text-left"><h2 class="font-bold text-gray-500 text-sm uppercase tracking-widest mb-4 text-center">Your sentences</h2><div v-for="exercise in completed" :key="exercise.exerciseNumber" class="flex gap-3 py-3 border-b last:border-0"><span class="w-8 h-8 bg-purple-600 text-white rounded-full grid place-items-center font-bold">{{ exercise.exerciseNumber }}</span><p class="text-xl font-semibold text-gray-800">“{{ exercise.sentenceProduced }}”</p></div></div><div class="flex gap-4 justify-center"><button v-if="results.config.showResultsToChild" @click="$emit('summary')" class="border-2 border-purple-600 text-purple-600 font-bold px-7 py-3 rounded-2xl">See your results</button><button @click="$emit('finish')" class="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-2xl">Main menu</button></div></div></div></BVChildShell>
</template>

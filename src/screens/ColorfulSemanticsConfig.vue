<script setup lang="ts">
import { computed, ref } from 'vue'
import BVClinicianShell from '../components/BVClinicianShell.vue'
import type { SessionConfig, SupportLevel } from '../types/session'
const emit = defineEmits<{ start: [config: Omit<SessionConfig, 'launchContext'>]; back: [] }>()
const typedAnswerEnabled = ref(true)
const supportLevel = ref<SupportLevel>('standard')
const exerciseCount = ref(3)
const topicsText = ref('Pirates, Everyday actions')
const showResultsToChild = ref(true)
const topics = computed(() => topicsText.value.split(',').map(v => v.trim()).filter(Boolean))
const submit = () => emit('start', { typedAnswerEnabled: typedAnswerEnabled.value, supportLevel: supportLevel.value, exerciseCount: exerciseCount.value, topics: topics.value, showResultsToChild: showResultsToChild.value })
</script>

<template>
  <BVClinicianShell active-sidebar-item="training" subtitle="Semantics">
    <div class="p-6 bg-[#f8f8f8] min-h-full">
      <div class="flex items-center justify-between mb-6"><div><h1 class="text-2xl font-semibold text-gray-800">Colourful Semantics</h1><p class="text-sm text-gray-500 mt-1">Configure the child activity before starting.</p></div><button @click="emit('back')" class="text-gray-400 hover:text-gray-700 text-2xl">×</button></div>
      <div class="grid lg:grid-cols-2 gap-6 max-w-5xl">
        <section class="space-y-5">
          <div class="bg-white border border-gray-200 rounded-xl p-5"><h2 class="font-semibold text-gray-800 mb-3">Sentence structure</h2><div class="space-y-2"><div class="bg-orange-100 border border-orange-300 text-orange-800 rounded-lg px-3 py-2"><b>WHO</b> — the person or character</div><div class="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg px-3 py-2"><b>DOING</b> — the action</div><div class="bg-green-100 border border-green-300 text-green-800 rounded-lg px-3 py-2"><b>WHAT</b> — the object involved</div></div></div>
          <div class="bg-white border border-purple-200 rounded-xl p-5 space-y-5">
            <div><label for="topics" class="text-sm font-semibold text-gray-700">Topics</label><p class="text-xs text-gray-400 mb-2">Separate topics with commas. These seed future exercise generation.</p><input id="topics" v-model="topicsText" class="w-full border border-gray-200 focus:border-purple-500 rounded-lg px-3 py-2 outline-none" placeholder="pirates, animals, school" /></div>
            <div class="flex items-center justify-between"><div><label class="text-sm font-semibold text-gray-700">Number of exercises</label><p class="text-xs text-gray-400">1–3 exercises per session</p></div><div class="flex items-center gap-2"><button @click="exerciseCount = Math.max(1, exerciseCount - 1)" class="w-8 h-8 border rounded-lg">−</button><b>{{ exerciseCount }}</b><button @click="exerciseCount = Math.min(3, exerciseCount + 1)" class="w-8 h-8 border rounded-lg">+</button></div></div>
            <label class="flex items-start gap-3"><input v-model="typedAnswerEnabled" type="checkbox" class="mt-1 accent-purple-600" /><span><b class="text-sm text-gray-700">Allow typed answers</b><small class="block text-xs text-gray-400">The child can type or choose a card.</small></span></label>
            <div><p class="text-sm font-semibold text-gray-700 mb-2">Support level</p><label v-for="option in [{value:'minimal',label:'Minimal',desc:'Independent responses only'},{value:'standard',label:'Standard',desc:'Hint available on request'},{value:'higher',label:'Higher',desc:'Hint after the first incorrect attempt'}]" :key="option.value" class="flex gap-3 border rounded-lg p-3 mb-2 cursor-pointer"><input v-model="supportLevel" type="radio" :value="option.value" class="mt-1 accent-purple-600" /><span><b class="text-sm">{{ option.label }}</b><small class="block text-xs text-gray-500">{{ option.desc }}</small></span></label></div>
            <label class="flex items-start gap-3 border rounded-lg bg-gray-50 p-3"><input v-model="showResultsToChild" type="checkbox" class="mt-1 accent-purple-600" /><span><b class="text-sm text-gray-700">Show detailed results to child</b><small class="block text-xs text-gray-500">If disabled, only a simple completion message is shown.</small></span></label>
          </div>
        </section>
        <section class="bg-white border border-gray-200 rounded-xl p-5 h-fit"><h2 class="font-semibold text-gray-800 mb-4">Preview — child activity</h2><div class="flex gap-2 mb-5"><span class="flex-1 bg-orange-100 text-orange-700 rounded-lg p-3 text-center font-bold">WHO?</span><span class="flex-1 bg-yellow-100 text-yellow-700 rounded-lg p-3 text-center font-bold">DOING?</span><span class="flex-1 bg-green-100 text-green-700 rounded-lg p-3 text-center font-bold">WHAT?</span></div><div class="bg-gray-50 rounded-xl p-5 text-center text-gray-500">The child builds one sentence through three tasks.</div><dl class="grid grid-cols-3 gap-3 mt-5 text-center text-xs text-gray-500"><div><b class="block text-lg text-gray-800">{{ exerciseCount }}</b>exercises</div><div><b class="block text-lg text-gray-800">{{ typedAnswerEnabled ? 'On' : 'Off' }}</b>typed answers</div><div><b class="block text-lg text-gray-800 capitalize">{{ supportLevel }}</b>support</div></dl></section>
      </div>
      <div class="flex justify-end gap-3 mt-6"><button @click="submit" class="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl">Start training</button></div>
    </div>
  </BVClinicianShell>
</template>

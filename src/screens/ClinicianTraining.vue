<script setup lang="ts">
import BVClinicianShell from '../components/BVClinicianShell.vue'
defineEmits<{ open: [] }>()
</script>

<template>
  <BVClinicianShell active-sidebar-item="training">
    <div class="p-10 max-w-4xl">
      <p class="text-xs uppercase tracking-widest text-purple-600 font-bold mb-2">Training</p>
      <h1 class="text-3xl font-bold text-gray-800 mb-3">Choose a training activity</h1>
      <p class="text-gray-500 max-w-xl mb-8">Create simple sentences with Colourful Semantics using WHO, DOING and WHAT.</p>
      <button @click="$emit('open')" class="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold px-6 py-3 rounded-xl shadow-md">Open Colourful Semantics →</button>
    </div>
  </BVClinicianShell>
</template>

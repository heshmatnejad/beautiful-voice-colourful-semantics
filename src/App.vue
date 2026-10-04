<script setup lang="ts">
import { computed, ref } from 'vue'
import ClinicianTraining from './screens/ClinicianTraining.vue'
import ColorfulSemanticsConfig from './screens/ColorfulSemanticsConfig.vue'
import ChildIntro from './screens/ChildIntro.vue'
import Exercise from './screens/Exercise.vue'
import SessionComplete from './screens/SessionComplete.vue'
import Summary from './screens/Summary.vue'
import type { ExerciseResult, SessionConfig, SessionResults } from './types/session'

type Screen = 'training' | 'config' | 'intro' | 'exercise' | 'complete' | 'summary'
const screen = ref<Screen>('training')
const exerciseNumber = ref<1 | 2 | 3>(1)
const sessionStart = ref(new Date())
const config = ref<SessionConfig>({ launchContext: 'clinic', typedAnswerEnabled: true, supportLevel: 'standard', exerciseCount: 3, topics: ['Pirates', 'Everyday actions'], showResultsToChild: true })
const exerciseResults = ref<(ExerciseResult | null)[]>([null, null, null])
const sessionResults = computed<SessionResults>(() => ({ config: config.value, exercises: exerciseResults.value, sessionStart: sessionStart.value, sessionEnd: new Date() }))

function start(configWithoutContext: Omit<SessionConfig, 'launchContext'>) {
  config.value = { ...configWithoutContext, launchContext: 'clinic' }
  exerciseNumber.value = 1; exerciseResults.value = [null, null, null]; sessionStart.value = new Date(); screen.value = 'intro'
}
function complete(result: ExerciseResult) {
  exerciseResults.value[result.exerciseNumber - 1] = result
  if (result.exerciseNumber < config.value.exerciseCount) {
    exerciseNumber.value = (result.exerciseNumber + 1) as 1 | 2 | 3
  } else screen.value = 'complete'
}
function reset() { screen.value = 'training' }
</script>

<template>
  <ClinicianTraining v-if="screen === 'training'" @open="screen = 'config'" />
  <ColorfulSemanticsConfig v-else-if="screen === 'config'" @start="start" @back="reset" />
  <ChildIntro v-else-if="screen === 'intro'" :config="config" @start="screen = 'exercise'" />
  <Exercise v-else-if="screen === 'exercise'" :exercise-number="exerciseNumber" :config="config" @complete="complete" />
  <SessionComplete v-else-if="screen === 'complete'" :results="sessionResults" @summary="screen = 'summary'" @finish="reset" />
  <Summary v-else :results="sessionResults" @done="reset" />
</template>

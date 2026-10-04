import { useState } from 'react'
import { ClinicianTraining } from './screens/ClinicianTraining'
import { ColorfulSemanticsConfig } from './screens/ColorfulSemanticsConfig'
import { HomeworkAdded } from './screens/HomeworkAdded'
import { AoCGuidance } from './screens/AoCGuidance'
import { ChildIntro } from './screens/ChildIntro'
import { ExerciseScreen, type ExerciseId } from './screens/ExerciseScreen'
import { SessionComplete } from './screens/SessionComplete'
import { ParentSummary } from './screens/ParentSummary'
import { Summary } from './screens/Summary'
import type { SessionConfig, SessionResults, ExerciseResult } from './types/session'

type Screen =
  | 'training'
  | 'cs-config'
  | 'homework-added'
  | 'aoc-guidance'
  | 'child-intro'
  | 'exercise'
  | 'session-complete'
  | 'parent-summary'
  | 'summary'

interface ClinicConfig {
  typedAnswerEnabled: boolean
  supportLevel: SessionConfig['supportLevel']
  exerciseCount: number
}

const DEFAULT_SESSION_CONFIG: SessionConfig = {
  launchContext: 'clinic',
  typedAnswerEnabled: true,
  supportLevel: 'standard',
  exerciseCount: 3,
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('training')
  const [exerciseId, setExerciseId] = useState<ExerciseId>(1)
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>(DEFAULT_SESSION_CONFIG)
  const [exerciseResults, setExerciseResults] = useState<(ExerciseResult | null)[]>([null, null, null])
  const [sessionStart, setSessionStart] = useState<Date>(new Date())

  const startSession = (config: SessionConfig) => {
    setSessionConfig(config)
    setExerciseId(1)
    setExerciseResults([null, null, null])
    setSessionStart(new Date())
    setScreen('child-intro')
  }

  const handleStartTraining = (cfg: ClinicConfig) => {
    startSession({ ...cfg, launchContext: 'clinic' })
  }

  const handleAddToHomework = (cfg: ClinicConfig) => {
    // Store config for when homework is launched, keep launchContext pending
    setSessionConfig({ ...cfg, launchContext: 'home' })
    setScreen('homework-added')
  }

  const handleStartFromHomework = () => {
    // Home launch → show AoC guidance first
    setExerciseId(1)
    setExerciseResults([null, null, null])
    setSessionStart(new Date())
    setScreen('aoc-guidance')
  }

  const handleExerciseComplete = (result: ExerciseResult) => {
    const idx = result.exerciseNumber - 1
    setExerciseResults(prev => {
      const next = [...prev]
      next[idx] = result
      return next
    })
    if (result.exerciseNumber < sessionConfig.exerciseCount) {
      setExerciseId((result.exerciseNumber + 1) as ExerciseId)
    } else {
      setScreen('session-complete')
    }
  }

  const getSessionResults = (): SessionResults => ({
    config: sessionConfig,
    exercises: exerciseResults,
    sessionStart,
    sessionEnd: new Date(),
  })

  switch (screen) {
    case 'training':
      return (
        <ClinicianTraining
          onOpenColorfulSemantics={() => setScreen('cs-config')}
        />
      )

    case 'cs-config':
      return (
        <ColorfulSemanticsConfig
          onAddToHomework={handleAddToHomework}
          onStartTraining={handleStartTraining}
          onBack={() => setScreen('training')}
        />
      )

    case 'homework-added':
      return (
        <HomeworkAdded
          onStartFromList={handleStartFromHomework}
          onBack={() => setScreen('cs-config')}
        />
      )

    case 'aoc-guidance':
      return (
        <AoCGuidance
          onStart={() => setScreen('child-intro')}
        />
      )

    case 'child-intro':
      return (
        <ChildIntro
          sessionConfig={sessionConfig}
          onStart={() => setScreen('exercise')}
        />
      )

    case 'exercise':
      return (
        <ExerciseScreen
          key={exerciseId}
          exerciseId={exerciseId}
          sessionConfig={sessionConfig}
          onComplete={handleExerciseComplete}
        />
      )

    case 'session-complete':
      return (
        <SessionComplete
          sessionResults={getSessionResults()}
          onShowParentSummary={() => setScreen('parent-summary')}
          onSeeSummary={() => setScreen('summary')}
          onFinish={() => setScreen('training')}
        />
      )

    case 'parent-summary':
      return (
        <ParentSummary
          sessionResults={getSessionResults()}
          onDone={() => setScreen('training')}
        />
      )

    case 'summary':
      return (
        <Summary
          sessionResults={getSessionResults()}
          onDone={() => setScreen('training')}
        />
      )
  }
}

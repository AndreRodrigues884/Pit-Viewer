import { useMemo, useState } from 'react'
import type { Vector3 } from 'three'
import type { CameraMode } from './camera/CameraRig'
import { DEFAULT_GOAL, evaluateGame } from './game/goal'
import { summarize } from './game/summary'
import { DEFAULT_PIT, type Block, type PitConfig } from './scene/blockModel'
import type { TerrainView } from './scene/terrain'
import { BlockPanel } from './ui/BlockPanel'
import { GamePanel } from './ui/GamePanel'
import { MeasurePanel } from './ui/MeasurePanel'
import { SettingsPanel } from './ui/SettingsPanel'
import { Toolbar } from './ui/Toolbar'
import type { DigResult, InteractionMode } from './viewer/createViewer'
import { Viewer } from './viewer/Viewer'

const INITIAL_VIEW: TerrainView = {
  visibleTypes: { soil: true, waste: true, ore: true },
  section: 1,
}

export default function App() {
  const [pitConfig, setPitConfig] = useState<PitConfig>(DEFAULT_PIT)
  const [terrainView, setTerrainView] = useState(INITIAL_VIEW)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('select')
  const [cameraMode, setCameraMode] = useState<CameraMode>('perspective')
  const [shadows, setShadows] = useState(true)
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [measurePoints, setMeasurePoints] = useState<Vector3[]>([])
  const [lastDig, setLastDig] = useState<DigResult | null>(null)
  const [showMineable, setShowMineable] = useState(true)
  const [gameId, setGameId] = useState(0)

  const summary = useMemo(() => summarize(lastDig?.minedBlocks ?? []), [lastDig])
  const status = evaluateGame(summary, DEFAULT_GOAL)

  return (
    <>
      <Viewer
        pitConfig={pitConfig}
        terrainView={terrainView}
        interactionMode={interactionMode}
        cameraMode={cameraMode}
        shadows={shadows}
        digEnabled={status === 'playing'}
        showMineable={showMineable}
        gameId={gameId}
        onSelectBlock={setSelectedBlock}
        onMeasure={setMeasurePoints}
        onDig={setLastDig}
      />
      <Toolbar
        interactionMode={interactionMode}
        cameraMode={cameraMode}
        shadows={shadows}
        settingsOpen={settingsOpen}
        onInteractionModeChange={setInteractionMode}
        onToggleCamera={() =>
          setCameraMode((mode) => (mode === 'perspective' ? 'orthographic' : 'perspective'))
        }
        onToggleShadows={() => setShadows((enabled) => !enabled)}
        onToggleSettings={() => setSettingsOpen((open) => !open)}
      />
      {settingsOpen && (
        <SettingsPanel
          config={pitConfig}
          view={terrainView}
          onApplyConfig={setPitConfig}
          onViewChange={setTerrainView}
        />
      )}
      {interactionMode === 'select' && <BlockPanel block={selectedBlock} />}
      {interactionMode === 'measure' && <MeasurePanel points={measurePoints} />}
      {interactionMode === 'dig' && (
        <GamePanel
          goal={DEFAULT_GOAL}
          summary={summary}
          status={status}
          lastDig={lastDig}
          customModel={pitConfig !== DEFAULT_PIT}
          showMineable={showMineable}
          onShowMineableChange={setShowMineable}
          onNewGame={() => setGameId((id) => id + 1)}
        />
      )}
    </>
  )
}

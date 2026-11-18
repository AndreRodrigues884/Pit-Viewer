import { useState } from 'react'
import type { Vector3 } from 'three'
import type { CameraMode } from './camera/CameraRig'
import type { Block } from './scene/blockModel'
import { BlockPanel } from './ui/BlockPanel'
import { DigPanel } from './ui/DigPanel'
import { MeasurePanel } from './ui/MeasurePanel'
import { Toolbar } from './ui/Toolbar'
import type { DigResult, InteractionMode } from './viewer/createViewer'
import { Viewer } from './viewer/Viewer'

export default function App() {
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('select')
  const [cameraMode, setCameraMode] = useState<CameraMode>('perspective')
  const [shadows, setShadows] = useState(true)
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [measurePoints, setMeasurePoints] = useState<Vector3[]>([])
  const [digResult, setDigResult] = useState<DigResult | null>(null)

  return (
    <>
      <Viewer
        interactionMode={interactionMode}
        cameraMode={cameraMode}
        shadows={shadows}
        onSelectBlock={setSelectedBlock}
        onMeasure={setMeasurePoints}
        onDig={setDigResult}
      />
      <Toolbar
        interactionMode={interactionMode}
        cameraMode={cameraMode}
        shadows={shadows}
        onInteractionModeChange={setInteractionMode}
        onToggleCamera={() =>
          setCameraMode((mode) => (mode === 'perspective' ? 'orthographic' : 'perspective'))
        }
        onToggleShadows={() => setShadows((enabled) => !enabled)}
      />
      {interactionMode === 'select' && <BlockPanel block={selectedBlock} />}
      {interactionMode === 'measure' && <MeasurePanel points={measurePoints} />}
      {interactionMode === 'dig' && <DigPanel result={digResult} />}
    </>
  )
}

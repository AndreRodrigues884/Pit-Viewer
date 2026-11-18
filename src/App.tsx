import { useState } from 'react'
import type { Vector3 } from 'three'
import type { CameraMode } from './camera/CameraRig'
import type { Block } from './scene/blockModel'
import { BlockPanel } from './ui/BlockPanel'
import { MeasurePanel } from './ui/MeasurePanel'
import { Toolbar } from './ui/Toolbar'
import type { InteractionMode } from './viewer/createViewer'
import { Viewer } from './viewer/Viewer'

export default function App() {
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('select')
  const [cameraMode, setCameraMode] = useState<CameraMode>('perspective')
  const [shadows, setShadows] = useState(true)
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [measurePoints, setMeasurePoints] = useState<Vector3[]>([])

  return (
    <>
      <Viewer
        interactionMode={interactionMode}
        cameraMode={cameraMode}
        shadows={shadows}
        onSelectBlock={setSelectedBlock}
        onMeasure={setMeasurePoints}
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
      {interactionMode === 'select' ? (
        <BlockPanel block={selectedBlock} />
      ) : (
        <MeasurePanel points={measurePoints} />
      )}
    </>
  )
}

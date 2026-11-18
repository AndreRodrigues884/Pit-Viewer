import { useState } from 'react'
import type { CameraMode } from './camera/CameraRig'
import type { Block } from './scene/blockModel'
import { BlockPanel } from './ui/BlockPanel'
import { Toolbar } from './ui/Toolbar'
import { Viewer } from './viewer/Viewer'

export default function App() {
  const [cameraMode, setCameraMode] = useState<CameraMode>('perspective')
  const [shadows, setShadows] = useState(true)
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)

  return (
    <>
      <Viewer cameraMode={cameraMode} shadows={shadows} onSelectBlock={setSelectedBlock} />
      <Toolbar
        cameraMode={cameraMode}
        shadows={shadows}
        onToggleCamera={() =>
          setCameraMode((mode) => (mode === 'perspective' ? 'orthographic' : 'perspective'))
        }
        onToggleShadows={() => setShadows((enabled) => !enabled)}
      />
      <BlockPanel block={selectedBlock} />
    </>
  )
}

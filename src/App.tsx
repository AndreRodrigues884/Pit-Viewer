import { useState } from 'react'
import type { CameraMode } from './camera/CameraRig'
import { Toolbar } from './ui/Toolbar'
import { Viewer } from './viewer/Viewer'

export default function App() {
  const [cameraMode, setCameraMode] = useState<CameraMode>('perspective')
  const [shadows, setShadows] = useState(true)

  return (
    <>
      <Viewer cameraMode={cameraMode} shadows={shadows} />
      <Toolbar
        cameraMode={cameraMode}
        shadows={shadows}
        onToggleCamera={() =>
          setCameraMode((mode) => (mode === 'perspective' ? 'orthographic' : 'perspective'))
        }
        onToggleShadows={() => setShadows((enabled) => !enabled)}
      />
    </>
  )
}

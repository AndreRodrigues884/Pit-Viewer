import type { CameraMode } from '../camera/CameraRig'

interface ToolbarProps {
  cameraMode: CameraMode
  shadows: boolean
  onToggleCamera: () => void
  onToggleShadows: () => void
}

export function Toolbar({ cameraMode, shadows, onToggleCamera, onToggleShadows }: ToolbarProps) {
  return (
    <div className="toolbar">
      <button type="button" onClick={onToggleCamera}>
        Camera: {cameraMode === 'perspective' ? 'Perspective' : 'Orthographic'}
      </button>
      <button type="button" onClick={onToggleShadows} aria-pressed={shadows}>
        Shadows: {shadows ? 'On' : 'Off'}
      </button>
    </div>
  )
}

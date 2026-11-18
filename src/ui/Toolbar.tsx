import type { CameraMode } from '../camera/CameraRig'
import type { InteractionMode } from '../viewer/createViewer'

interface ToolbarProps {
  interactionMode: InteractionMode
  cameraMode: CameraMode
  shadows: boolean
  settingsOpen: boolean
  onInteractionModeChange: (mode: InteractionMode) => void
  onToggleCamera: () => void
  onToggleShadows: () => void
  onToggleSettings: () => void
}

const MODES: { value: InteractionMode; label: string }[] = [
  { value: 'select', label: 'Select' },
  { value: 'measure', label: 'Measure' },
  { value: 'dig', label: 'Dig' },
]

export function Toolbar({
  interactionMode,
  cameraMode,
  shadows,
  settingsOpen,
  onInteractionModeChange,
  onToggleCamera,
  onToggleShadows,
  onToggleSettings,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="segmented" role="group" aria-label="Interaction mode">
        {MODES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={interactionMode === value}
            onClick={() => onInteractionModeChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <button type="button" onClick={onToggleCamera}>
        Camera: {cameraMode === 'perspective' ? 'Perspective' : 'Orthographic'}
      </button>
      <button type="button" onClick={onToggleShadows} aria-pressed={shadows}>
        Shadows: {shadows ? 'On' : 'Off'}
      </button>
      <button type="button" onClick={onToggleSettings} aria-pressed={settingsOpen}>
        Settings
      </button>
    </div>
  )
}

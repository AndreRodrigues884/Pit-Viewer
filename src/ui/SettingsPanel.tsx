import { useState } from 'react'
import { CONFIG_LIMITS, DEFAULT_PIT, normalizeConfig, type PitConfig } from '../scene/blockModel'
import { BLOCK_COLORS, BLOCK_LABELS, BLOCK_TYPES } from '../scene/blockTypes'
import type { TerrainView } from '../scene/terrain'

interface SettingsPanelProps {
  config: PitConfig
  view: TerrainView
  onApplyConfig: (config: PitConfig) => void
  onViewChange: (view: TerrainView) => void
}

export function SettingsPanel({ config, view, onApplyConfig, onViewChange }: SettingsPanelProps) {
  const [draft, setDraft] = useState(config)
  const update = (patch: Partial<PitConfig>) => setDraft(normalizeConfig({ ...draft, ...patch }))

  return (
    <aside className="panel settings" aria-label="Settings">
      <h2>View</h2>
      <div className="type-filters">
        {BLOCK_TYPES.map((type) => (
          <label key={type} className="toggle">
            <input
              type="checkbox"
              checked={view.visibleTypes[type]}
              onChange={(event) =>
                onViewChange({
                  ...view,
                  visibleTypes: { ...view.visibleTypes, [type]: event.target.checked },
                })
              }
            />
            <span className="swatch" style={{ background: BLOCK_COLORS[type] }} />
            {BLOCK_LABELS[type]}
          </label>
        ))}
      </div>
      <Slider
        label="Cross-section"
        value={Math.round(view.section * 100)}
        min={5}
        max={100}
        step={5}
        unit="%"
        onChange={(value) => onViewChange({ ...view, section: value / 100 })}
      />

      <h2>Model</h2>
      <Slider
        label="Grid size"
        value={draft.size}
        min={CONFIG_LIMITS.size[0]}
        max={CONFIG_LIMITS.size[1]}
        step={2}
        onChange={(size) => update({ size })}
      />
      <Slider
        label="Levels"
        value={draft.levels}
        min={CONFIG_LIMITS.levels[0]}
        max={CONFIG_LIMITS.levels[1]}
        onChange={(levels) => update({ levels })}
      />
      <Slider
        label="Pit floor level"
        value={draft.pitBottomLevel}
        min={1}
        max={draft.levels - 1}
        onChange={(pitBottomLevel) => update({ pitBottomLevel })}
      />
      <Slider
        label="Pit floor radius"
        value={draft.bottomRadius}
        min={CONFIG_LIMITS.bottomRadius[0]}
        max={CONFIG_LIMITS.bottomRadius[1]}
        onChange={(bottomRadius) => update({ bottomRadius })}
      />
      <Slider
        label="Bench width"
        value={draft.benchWidth}
        min={CONFIG_LIMITS.benchWidth[0]}
        max={CONFIG_LIMITS.benchWidth[1]}
        onChange={(benchWidth) => update({ benchWidth })}
      />
      <Slider
        label="Ore body level"
        value={draft.oreLevel}
        min={0}
        max={draft.levels - 2}
        onChange={(oreLevel) => update({ oreLevel })}
      />

      <div className="actions">
        <button type="button" className="primary" onClick={() => onApplyConfig(draft)}>
          Generate
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft(DEFAULT_PIT)
            onApplyConfig(DEFAULT_PIT)
          }}
        >
          Defaults
        </button>
      </div>
    </aside>
  )
}

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
}

function Slider({ label, value, min, max, step = 1, unit = '', onChange }: SliderProps) {
  return (
    <label className="slider">
      <span>{label}</span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <output>
        {value}
        {unit}
      </output>
    </label>
  )
}

import type { Vector3 } from 'three'
import { distance } from '../measurement/distance'
import { formatPoint } from './formatPoint'

interface MeasurePanelProps {
  points: Vector3[]
}

export function MeasurePanel({ points }: MeasurePanelProps) {
  const [start, end] = points

  return (
    <aside className="panel" aria-label="Measurement">
      <h2>Measure distance</h2>
      {start ? (
        <dl>
          <dt>Point A</dt>
          <dd>{formatPoint(start)}</dd>
          <dt>Point B</dt>
          <dd>{end ? formatPoint(end) : 'Click a second point'}</dd>
          {end && (
            <>
              <dt>Distance</dt>
              <dd className="distance">{distance(start, end).toFixed(2)} m</dd>
            </>
          )}
        </dl>
      ) : (
        <p className="hint">Click two points on the terrain.</p>
      )}
    </aside>
  )
}

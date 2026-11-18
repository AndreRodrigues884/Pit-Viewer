import { useEffect, useRef } from 'react'
import type { CameraMode } from '../camera/CameraRig'
import { createViewer, type ViewerHandle } from './createViewer'

interface ViewerProps {
  cameraMode: CameraMode
  shadows: boolean
}

export function Viewer({ cameraMode, shadows }: ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<ViewerHandle | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const viewer = createViewer(container)
    viewerRef.current = viewer

    return () => {
      viewer.dispose()
      viewerRef.current = null
    }
  }, [])

  useEffect(() => {
    viewerRef.current?.setCameraMode(cameraMode)
  }, [cameraMode])

  useEffect(() => {
    viewerRef.current?.setShadows(shadows)
  }, [shadows])

  return <div ref={containerRef} className="viewer" />
}

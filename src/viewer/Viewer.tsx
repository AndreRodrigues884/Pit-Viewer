import { useEffect, useRef } from 'react'
import type { CameraMode } from '../camera/CameraRig'
import type { Block } from '../scene/blockModel'
import { createViewer, type ViewerHandle } from './createViewer'

interface ViewerProps {
  cameraMode: CameraMode
  shadows: boolean
  onSelectBlock: (block: Block | null) => void
}

export function Viewer({ cameraMode, shadows, onSelectBlock }: ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<ViewerHandle | null>(null)
  const onSelectBlockRef = useRef(onSelectBlock)

  useEffect(() => {
    onSelectBlockRef.current = onSelectBlock
  }, [onSelectBlock])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const viewer = createViewer(container, {
      onSelectBlock: (block) => onSelectBlockRef.current(block),
    })
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

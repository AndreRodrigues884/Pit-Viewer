import { useEffect, useRef } from 'react'
import type { CameraMode } from '../camera/CameraRig'
import {
  createViewer,
  type InteractionMode,
  type ViewerHandle,
  type ViewerOptions,
} from './createViewer'

interface ViewerProps extends ViewerOptions {
  cameraMode: CameraMode
  shadows: boolean
  interactionMode: InteractionMode
  digEnabled: boolean
  showMineable: boolean
  gameId: number
}

export function Viewer({
  cameraMode,
  shadows,
  interactionMode,
  digEnabled,
  showMineable,
  gameId,
  ...callbacks
}: ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<ViewerHandle | null>(null)
  const callbacksRef = useRef(callbacks)

  useEffect(() => {
    callbacksRef.current = callbacks
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const viewer = createViewer(container, {
      onSelectBlock: (block) => callbacksRef.current.onSelectBlock(block),
      onMeasure: (points) => callbacksRef.current.onMeasure(points),
      onDig: (result) => callbacksRef.current.onDig(result),
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

  useEffect(() => {
    viewerRef.current?.setInteractionMode(interactionMode)
  }, [interactionMode])

  useEffect(() => {
    viewerRef.current?.setDigEnabled(digEnabled)
  }, [digEnabled])

  useEffect(() => {
    viewerRef.current?.setShowMineable(showMineable)
  }, [showMineable])

  useEffect(() => {
    viewerRef.current?.resetGame()
  }, [gameId])

  return <div ref={containerRef} className="viewer" />
}

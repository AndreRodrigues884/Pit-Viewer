import type { Vector2 } from 'three'

const CLICK_TOLERANCE_PX = 5

export function toNormalizedPointer(event: PointerEvent, element: HTMLElement, target: Vector2) {
  const rect = element.getBoundingClientRect()
  target.set(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1,
  )
  return target
}

export function listenForClicks(element: HTMLElement, onClick: (event: PointerEvent) => void) {
  let start: { x: number; y: number } | null = null

  const handleDown = (event: PointerEvent) => {
    start = event.button === 0 ? { x: event.clientX, y: event.clientY } : null
  }

  const handleUp = (event: PointerEvent) => {
    if (!start) return
    const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y)
    start = null
    if (moved <= CLICK_TOLERANCE_PX) onClick(event)
  }

  element.addEventListener('pointerdown', handleDown)
  element.addEventListener('pointerup', handleUp)

  return () => {
    element.removeEventListener('pointerdown', handleDown)
    element.removeEventListener('pointerup', handleUp)
  }
}

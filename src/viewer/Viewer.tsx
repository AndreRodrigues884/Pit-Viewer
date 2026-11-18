import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export function Viewer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#1b1f24')
    scene.add(new THREE.AxesHelper(10))

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
    camera.position.set(40, 30, 40)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = container
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    let frameId = 0
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      controls.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="viewer" />
}

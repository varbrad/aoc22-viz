import { Canvas } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera, Stage } from '@react-three/drei'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import * as THREE from 'three'

import { d18getCenter, d18points } from '~/days/d18'
import { useState } from 'react'
import { useSpring, animated } from '@react-spring/three'

const geom = new THREE.BoxGeometry(1, 1, 1)

type LoaderData = {
  points: { x: number; y: number; z: number }[]
  center: { x: number; y: number; z: number }
}

export const loader: LoaderFunction = () => {
  return json<LoaderData>({ points: d18points, center: d18getCenter() })
}

export default function Index() {
  const { points, center } = useLoaderData<LoaderData>()

  const [open, setOpen] = useState(false)

  const animation = useSpring({
    scale: open ? 0.25 : 1,
    opacity: open ? 0.05 : 1,
  })

  return (
    <div className='relative w-screen min-h-screen h-screen bg-slate-900 p-3'>
      <div className='w-full h-full bg-slate-800'>
        <button
          className='absolute left-6 top-6 bg-white z-10 p-3 rounded-md'
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Open'}
        </button>
        <Canvas frameloop='demand' onLoad={() => console.log('loaded')}>
          <OrthographicCamera makeDefault position={[-10, 8, 8]} />
          <Stage
            adjustCamera
            intensity={0.5}
            shadows='contact'
            environment='city'
          >
            {points.map(({ x, y, z }, ix) => {
              const _x = (x - center.x) * 1
              const _y = (y - center.y) * 1
              const _z = (z - center.z) * 1

              return (
                <animated.mesh
                  key={ix}
                  geometry={geom}
                  position={[_x, _y, _z]}
                  scale={animation.scale}
                >
                  <animated.meshPhongMaterial
                    color='#f3f3f3'
                    opacity={animation.opacity}
                    transparent
                  />
                </animated.mesh>
              )
            })}
            <OrbitControls />
          </Stage>
        </Canvas>
      </div>
    </div>
  )
}

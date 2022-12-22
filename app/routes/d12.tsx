import { Canvas } from '@react-three/fiber'
import {
  Line,
  OrbitControls,
  OrthographicCamera,
  Stage,
} from '@react-three/drei'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import * as THREE from 'three'

import * as d12 from '../days/d12'

const geom = new THREE.BoxGeometry(1, 1, 1)

type LoaderData = {
  nodes: d12.Node[]
  path: { x: number; y: number; height: number }[]
}

export const loader: LoaderFunction = () => {
  const p1 = d12.part1()
  let current = p1
  const path: LoaderData['path'] = []
  while (current) {
    path.push(current.node)
    if (current.parent && current.parent.node.height < current.node.height) {
      path.push({
        x: current.parent.node.x,
        y: current.parent.node.y,
        height: current.node.height,
      })
    }
    current = current.parent
  }
  return json<LoaderData>({ nodes: d12.nodes, path })
}

export default function Index() {
  const { nodes, path } = useLoaderData<LoaderData>()

  return (
    <div className='w-screen min-h-screen h-screen bg-slate-900 p-3'>
      <div className='w-full h-full bg-slate-800'>
        <Canvas frameloop='demand' onLoad={() => console.log('loaded')}>
          <OrthographicCamera makeDefault position={[-10, 8, 8]} />
          <Stage
            adjustCamera
            intensity={0.5}
            shadows='contact'
            environment='city'
          >
            {nodes.map(({ x, y, height }, ix) => {
              return (
                <mesh
                  key={ix}
                  geometry={geom}
                  position={[x, height / 2, y]}
                  scale={[1, height + 1, 1]}
                >
                  <meshPhongMaterial color='#f3f3f3' />
                </mesh>
              )
            })}
            <Line
              points={path.map(({ x, y, height }) => [x, height + 1, y])}
              color='hotpink'
              lineWidth={8}
            />
            <OrbitControls />
          </Stage>
        </Canvas>
      </div>
    </div>
  )
}

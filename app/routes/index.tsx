import { Canvas } from '@react-three/fiber'
import { Bounds, Box, OrbitControls, Stage } from '@react-three/drei'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import * as d12 from '../days/d12'

type LoaderData = {
  nodes: d12.Node[]
  path: d12.Node[]
}

export const loader: LoaderFunction = () => {
  const p1 = d12.part1()
  let current = p1
  const path = []
  while (current) {
    path.push(current.node)
    current = current.parent
  }
  return json<LoaderData>({ nodes: d12.nodes, path })
}

export default function Index() {
  const { nodes, path } = useLoaderData<LoaderData>()

  return (
    <div className='w-screen min-h-screen h-screen bg-slate-900 p-3'>
      <div className='w-full h-full bg-slate-800'>
        <Canvas>
          <Bounds clip observe>
            <Stage
              adjustCamera
              intensity={0.5}
              shadows='contact'
              environment='city'
            >
              {nodes.map(({ x, y, height }, ix) => (
                <Box
                  key={ix}
                  args={[1, height + 1, 1]}
                  position={[x, height / 2 + 1, y]}
                >
                  <meshPhongMaterial color='#f3f3f3' />
                </Box>
              ))}
              {path.map(({ x, y, height }, ix) => (
                <Box key={ix} args={[1, 1, 1]} position={[x, height + 2, y]}>
                  <meshPhongMaterial color='magenta' />
                </Box>
              ))}
            </Stage>
            <OrbitControls makeDefault />
          </Bounds>
        </Canvas>
      </div>
    </div>
  )
}

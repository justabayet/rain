import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
// import { Perf } from 'r3f-perf'
import Experience from './App/Experience'
import { KeyboardControls } from '@react-three/drei'
import { Leva } from 'leva'

function App(): JSX.Element {
  return (
    <KeyboardControls map={[
      { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
      { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
      { name: 'previous', keys: ['ArrowLeft', 'KeyA'] },
      { name: 'next', keys: ['ArrowRight', 'KeyD'] },
    ]}>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-15, 5, 4]
        }} >

        <Experience />

        <OrbitControls zoomSpeed={1} />

        {/* <Perf position="top-left" /> */}
      </Canvas>

      <Leva collapsed />
    </KeyboardControls>
  )
}

export default App

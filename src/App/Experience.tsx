import { Sky } from '@react-three/drei'
import Rain from './Rain'
import Ground from './Ground'

function Experience(): JSX.Element {
  const groundSize = 5

  return (
    <group position={[0, 0, 0]}>
      <Rain size={groundSize} position={[0, 2, 0]} />
      <Ground size={groundSize} />

      <ambientLight intensity={0.5} />
      <spotLight position={[-20, 10, 15]} intensity={100} decay={1} />
      <Sky sunPosition={[1, 0, 0]} turbidity={5} rayleigh={5} mieCoefficient={0.002} mieDirectionalG={0.89} inclination={0.34} />
    </group>
  )
}

export default Experience
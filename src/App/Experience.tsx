import { Cloud, Clouds, Sky } from '@react-three/drei'
import Rain from './Rain'
// import Ground from './Ground'
import { MeshBasicMaterial } from 'three'
import { useControls } from 'leva'

function Experience(): JSX.Element {
  const groundSize = 5

  const {
    cloudColor,
    cloudSeed,
    spotColor
  } = useControls({
    cloudColor: '#928282',
    spotColor: '#9a9a9a',
    cloudSeed: 0
  })

  return (
    <group position={[0, 0, 0]}>
      <Rain size={groundSize} position={[0, 4.3, 0]} />
      {/* <Ground size={10} /> */}

      <Clouds material={MeshBasicMaterial} position={[0, 4.6, 0]}>
        <Cloud
          concentrate='outside'
          speed={0.1}
          growth={1}
          smallestVolume={1}
          segments={50}
          bounds={[2, 0, 2]}
          volume={2}
          color={cloudColor}
          seed={cloudSeed}
          opacity={0.6} />
      </Clouds>

      <ambientLight intensity={0.1} />
      <spotLight position={[10, 2, 0]} intensity={2} decay={0} color={spotColor} penumbra={0.8} />
      {/* <spotLight position={[10, 0.1, 0]} intensity={10} decay={0} color={spotColor} penumbra={0.8} angle={0.1} /> */}
      <Sky sunPosition={[1, 0, 0]} turbidity={5} rayleigh={5} mieCoefficient={0.002} mieDirectionalG={0.89} inclination={0.34} />
    </group>
  )
}

export default Experience
import { Cloud, Clouds, Sky } from '@react-three/drei'
import Snow from './Snow'
import Ground from './Ground'
import { Group, InstancedMesh, Material, MeshBasicMaterial, Vector3 } from 'three'
import { useControls } from 'leva'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import WetGround from './WetGround'

function SnowScene(): JSX.Element {
  const groundSize = 5

  const {
    cloudColor,
    cloudSeed,
    spotColor,
    snowColor
  } = useControls({
    cloudColor: '#bebebe',
    spotColor: '#9a9a9a',
    cloudSeed: 0,
    snowColor: ''
  })

  const mistRef = useRef<Group>(null)

  const center = useMemo(() => {
    return new Vector3()
  }, [])

  useFrame(({ camera }) => {
    if (mistRef.current != null) {
      const minOpacity = 0
      const maxOpacity = 0.3
      const minDist = 15
      const maxDist = 50
      const rangeDist = maxDist - minDist

      const distance = camera.position.distanceTo(center)

      const material = (mistRef.current.parent?.children[1] as InstancedMesh).material as Material

      if (material != null) {

        if (distance < minDist) {
          material.opacity = minOpacity
        } else if (distance > maxDist) {
          material.opacity = maxOpacity
        } else {
          const factor = (distance - minDist) / rangeDist
          material.opacity = (maxOpacity - minOpacity) * factor
        }
      }
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <Snow size={groundSize} position={[0, 4.4, 0]} />

      {/* <mesh position={[0, 0.5, 0]}>
        <boxGeometry />
        <meshStandardMaterial color={'white'} />
      </mesh> */}

      <Ground size={10} />

      <Clouds material={MeshBasicMaterial} position={[0, 5.6, 0]}>
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

      <Clouds material={MeshBasicMaterial} position={[0, 1.6, 0]}>
        <Cloud
          ref={mistRef}
          concentrate='outside'
          speed={0.1}
          growth={1}
          smallestVolume={1}
          segments={8}
          bounds={[0.5, 1, 0.5]}
          volume={7}
          color={snowColor}
          seed={cloudSeed}
          opacity={0.07} />
      </Clouds>

      <WetGround size={groundSize} color={'#000000'} />

      <ambientLight intensity={0.1} />
      <spotLight position={[10, 2, 0]} intensity={2} decay={0} color={spotColor} penumbra={0.8} />
      <Sky sunPosition={[1, -0.1, 0]} turbidity={5} rayleigh={5} mieCoefficient={0.002} mieDirectionalG={0.89} inclination={0.34} />
    </group>
  )
}

export default SnowScene
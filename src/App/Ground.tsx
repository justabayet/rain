import { MeshProps } from '@react-three/fiber'
import { useControls } from 'leva'

interface GroundProps extends MeshProps {
  size?: number
}

function Ground({ size = 5, ...props }: GroundProps): JSX.Element {
  const height = size / 20

  const {
    groundColor,
  } = useControls({
    groundColor: '#688094',
  })

  return (
    <mesh {...props} rotation={[- Math.PI / 2, 0, 0]} position={[0, -height / 2, 0]}>
      <boxGeometry args={[size, size, height, 1, 1, 1]} />
      <meshStandardMaterial color={groundColor} />
    </mesh>
  )
}

export default Ground

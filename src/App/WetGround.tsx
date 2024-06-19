import { MeshProps } from '@react-three/fiber'

interface WetGroundProps extends MeshProps {
  size?: number
  color: string
}

function WetGround({ size = 5, color, ...props }: WetGroundProps): JSX.Element {
  const extraWidth = 1
  return (
    <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} {...props}>
      <planeGeometry args={[size + extraWidth, size + extraWidth, 16, 16]} />
      <meshBasicMaterial color={color} opacity={0.3} transparent />
    </mesh>
  )
}

export default WetGround

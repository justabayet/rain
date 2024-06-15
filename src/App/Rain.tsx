import { MeshProps, ReactThreeFiber, extend, useFrame } from '@react-three/fiber'
import rainVertexShader from './shaders/rain/vertex.glsl'
import rainFragmentShader from './shaders/rain/fragment.glsl'
import { shaderMaterial, useTexture } from '@react-three/drei'
import { ShaderMaterial, Texture, Color, RepeatWrapping } from 'three'
import { useRef } from 'react'
import { useControls } from 'leva'

interface RainMaterial extends ShaderMaterial {
  time: number
  rainColor: Color
  perlinTexture: Texture
}

const rainColor = new Color(0x0000FF)

const shaderDefault = {
  time: 0,
  rainColor,
  perlinTexture: null
}

const RainMaterial = shaderMaterial(
  shaderDefault,
  rainVertexShader,
  rainFragmentShader
)

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      rainMaterial: ReactThreeFiber.Object3DNode<RainMaterial, typeof RainMaterial>
    }
  }
}

extend({ RainMaterial })

interface RainProps extends MeshProps {
  size?: number
}

function Rain({ size = 5, ...props }: RainProps): JSX.Element {
  const rainMaterial = useRef<RainMaterial>(null)

  const perlinTexture = useTexture('./perlin.png', (texture) => {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.colorSpace = ''
  })

  const {
    rainColor
  } = useControls({
    rainColor: `#${shaderDefault.rainColor.getHexString()}`,
  })

  // const [, getKeys] = useKeyboardControls()

  useFrame(({ clock }) => {
    if (rainMaterial.current != null) {
      // const { forward, backward } = getKeys() // Tune time speed

      rainMaterial.current.time = clock.elapsedTime
    }
  })


  return (
    <mesh {...props} rotation={[- Math.PI / 2, 0, 0]} frustumCulled={false}>
      <planeGeometry args={[size, size, 30, 10]} />
      <rainMaterial
        ref={rainMaterial}
        perlinTexture={perlinTexture}
        rainColor={rainColor}
      // wireframe
      />
    </mesh>
  )
}

export default Rain

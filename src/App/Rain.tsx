import { GroupProps, ReactThreeFiber, extend, useFrame, useThree } from '@react-three/fiber'
import rainVertexShader from './shaders/rain/vertex.glsl'
import rainFragmentShader from './shaders/rain/fragment.glsl'
import { Points, shaderMaterial, useTexture } from '@react-three/drei'
import { ShaderMaterial, Texture, Color, RepeatWrapping, Vector2 } from 'three'
import { useMemo, useRef } from 'react'
import { useControls } from 'leva'

interface RainMaterial extends ShaderMaterial {
  time: number
  rainColor: Color
  perlinTexture: Texture
  resolution: Vector2
}

const rainColor = new Color(0x0000FF)

const shaderDefault = {
  time: 0,
  rainColor,
  perlinTexture: null,
  resolution: null
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

interface RainProps extends GroupProps {
  size?: number
  height?: number
}

const v2 = new Vector2()

function Rain({ size = 5, height = 5, ...props }: RainProps): JSX.Element {
  const count = 1000

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

  const positions = useMemo(() => {
    const positions = []

    const origin = new Vector2(-size / 2, -size / 2)

    for (let i = 0; i < count; i++) {
      const uv = new Vector2(Math.random(), Math.random())

      const position = uv.clone().multiplyScalar(size)

      const translation = origin.clone().add(position)

      positions.push(translation.x, 0, translation.y)
    }

    return new Float32Array(positions)
  }, [size])

  const { gl } = useThree()

  const sizes = gl.getSize(v2)
  const pixelRatio = gl.getPixelRatio()
  const resolution = new Vector2(sizes.x * pixelRatio, sizes.y * pixelRatio)

  return (
    <group {...props}>
      <Points positions={positions}>
        <rainMaterial
          ref={rainMaterial}
          perlinTexture={perlinTexture}
          rainColor={rainColor}
          resolution={resolution}
        />
      </Points>
    </group>
  )
}

export default Rain

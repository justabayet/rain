import { PointsProps, ReactThreeFiber, extend, useFrame, useThree } from '@react-three/fiber'
import rainVertexShader from './shaders/rain/vertex.glsl'
import rainFragmentShader from './shaders/rain/fragment.glsl'
import { shaderMaterial, useTexture } from '@react-three/drei'
import { ShaderMaterial, Texture, Color, RepeatWrapping, Vector2 } from 'three'
import { useMemo, useRef } from 'react'
import { useControls } from 'leva'

interface RainMaterial extends ShaderMaterial {
  time: number
  dropWidth: number
  opacity: number
  dropSize: number
  height: number
  areaSize: number
  speed: number
  rainColor: Color
  perlinTexture: Texture
  resolution: Vector2
}

const rainColor = new Color('#000000')

const shaderDefault = {
  time: 0,
  dropWidth: 0.02,
  opacity: 0.1,
  dropSize: 0.5,
  areaSize: 0,
  height: 4.6,
  speed: 2.5,
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

interface RainProps extends PointsProps {
  size?: number
}

const v2 = new Vector2()

function Rain({ size = 5, ...props }: RainProps): JSX.Element {
  const count = 1000

  const rainMaterial = useRef<RainMaterial>(null)

  const perlinTexture = useTexture('./perlin.png', (texture) => {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
  })

  const {
    rainColor,
    dropWidth,
    opacity,
    dropSize,
    height,
    speed
  } = useControls({
    rainColor: `#${shaderDefault.rainColor.getHexString()}`,
    opacity: {
      value: shaderDefault.opacity,
      min: 0,
      max: 1
    },
    dropWidth: {
      value: shaderDefault.dropWidth,
      min: 0,
      max: 1
    },
    dropSize: {
      value: shaderDefault.dropSize,
      min: 0,
    },
    height: {
      value: shaderDefault.height,
      min: 0,
    },
    speed: {
      value: shaderDefault.speed,
      min: 0,
    },
  })

  // const [, getKeys] = useKeyboardControls()

  useFrame(({ clock }) => {
    if (rainMaterial.current != null) {
      // const { forward, backward } = getKeys() // Tune time speed

      rainMaterial.current.time = clock.elapsedTime
    }
  })

  const { positions, custom } = useMemo(() => {
    const positions = []
    const custom = []

    const origin = new Vector2(-size / 2, -size / 2)

    for (let i = 0; i < count; i++) {
      const uv = new Vector2(Math.random(), Math.random())

      const position = uv.clone().multiplyScalar(size)

      const translation = origin.clone().add(position)

      positions.push(translation.x, 0, translation.y)
      custom.push(0, 0, 0)
    }

    return {
      positions: new Float32Array(positions),
      custom: new Float32Array(custom)
    }
  }, [size])

  const { gl } = useThree()

  const sizes = gl.getSize(v2)
  const pixelRatio = gl.getPixelRatio()
  const resolution = new Vector2(sizes.x * pixelRatio, sizes.y * pixelRatio)

  return (
    <points {...props}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach='attributes-custom'
          array={custom}
          count={custom.length / 3}
          itemSize={3}
        />
      </bufferGeometry>

      <rainMaterial
        ref={rainMaterial}
        perlinTexture={perlinTexture}
        rainColor={rainColor}
        resolution={resolution}
        dropWidth={dropWidth}
        opacity={opacity}
        dropSize={dropSize}
        height={height}
        areaSize={size}
        speed={speed}
        transparent
      />
    </points>
  )
}

export default Rain

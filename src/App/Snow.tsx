import { PointsProps, ReactThreeFiber, extend, useFrame, useThree } from '@react-three/fiber'
import snowVertexShader from './shaders/snow/vertex.glsl'
import snowFragmentShader from './shaders/snow/fragment.glsl'
import { shaderMaterial, useTexture } from '@react-three/drei'
import { ShaderMaterial, Texture, Color, RepeatWrapping, Vector2 } from 'three'
import { useMemo, useRef } from 'react'
import { useControls } from 'leva'

interface SnowMaterial extends ShaderMaterial {
  time: number
  dropWidth: number
  opacity: number
  opacityRipple: number
  dropSize: number
  height: number
  areaSize: number
  speed: number
  rippleThickness: number
  snowInnerColor: Color
  snowOuterColor: Color
  perlinTexture: Texture
  resolution: Vector2
}

const snowInnerColor = new Color('#a3a3a3')
const snowOuterColor = new Color('#a3a3a3')//new Color('#2c4e52')

const shaderDefault = {
  time: 0,
  dropWidth: 0.02,
  opacity: 0.85,
  opacityRipple: 0.75,
  dropSize: 0.1,
  areaSize: 0,
  height: 4.3,
  speed: 0.1,
  rippleThickness: 0.12,
  snowInnerColor,
  snowOuterColor,
  perlinTexture: null,
  resolution: null
}

const SnowMaterial = shaderMaterial(
  shaderDefault,
  snowVertexShader,
  snowFragmentShader
)

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      snowMaterial: ReactThreeFiber.Object3DNode<SnowMaterial, typeof SnowMaterial>
    }
  }
}

extend({ SnowMaterial })

interface SnowProps extends PointsProps {
  size?: number
}

const v2 = new Vector2()

function Snow({ size = 5, ...props }: SnowProps): JSX.Element {
  const count = 1000

  const snowMaterial = useRef<SnowMaterial>(null)

  const perlinTexture = useTexture('./perlin.png', (texture) => {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
  })

  const {
    dropWidth,
    opacity,
    opacityRipple,
    dropSize,
    height,
    speed,
    rippleThickness,
    snowInnerColor,
    snowOuterColor,
  } = useControls({
    snowInnerColor: `#${shaderDefault.snowInnerColor.getHexString()}`,
    snowOuterColor: `#${shaderDefault.snowOuterColor.getHexString()}`,
    opacity: {
      value: shaderDefault.opacity,
      min: 0,
      max: 1
    },
    opacityRipple: {
      value: shaderDefault.opacityRipple,
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
    rippleThickness: {
      value: shaderDefault.rippleThickness,
      min: 0,
      max: 0.5
    },
  })

  // const [, getKeys] = useKeyboardControls()

  useFrame(({ clock }) => {
    if (snowMaterial.current != null) {
      // const { forward, backward } = getKeys() // Tune time speed

      snowMaterial.current.time = clock.elapsedTime
    }
  })

  const { positions, custom, randomOffset } = useMemo(() => {
    const positions = []
    const custom = []
    const randomOffset = []

    const origin = new Vector2(-size / 2, -size / 2)

    for (let i = 0; i < count; i++) {
      const uv = new Vector2(Math.random(), Math.random())

      const position = uv.clone().multiplyScalar(size)

      const translation = origin.clone().add(position)

      positions.push(translation.x, 0, translation.y)
      custom.push(0, 0, 0)
      randomOffset.push(Math.random())
    }

    return {
      positions: new Float32Array(positions),
      custom: new Float32Array(custom),
      randomOffset: new Float32Array(randomOffset)
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
        <bufferAttribute
          attach='attributes-randomOffset'
          array={randomOffset}
          count={randomOffset.length}
          itemSize={1}
        />
      </bufferGeometry>

      <snowMaterial
        ref={snowMaterial}
        perlinTexture={perlinTexture}
        snowInnerColor={snowInnerColor}
        snowOuterColor={snowOuterColor}
        resolution={resolution}
        dropWidth={dropWidth}
        opacity={opacity}
        opacityRipple={opacityRipple}
        dropSize={dropSize}
        height={height}
        areaSize={size}
        speed={speed}
        rippleThickness={rippleThickness}
        // blending={AdditiveBlending}
        transparent
      />
    </points>
  )
}

export default Snow

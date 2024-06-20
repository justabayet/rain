import { useKeyboardControls } from '@react-three/drei'
import RainScene from './RainScene'
import { useEffect, useState } from 'react'
import SnowScene from './SnowScene'

function Experience(): JSX.Element {
  const [sub] = useKeyboardControls()

  const nbTabs = 2
  const [tab, setTab] = useState(1)

  useEffect(() => {
    return sub(
      (state) => state.previous,
      (pressed) => {
        if (pressed) {
          setTab(currentTab => (currentTab - 1 + nbTabs) % nbTabs)
        }
      }
    )
  }, [sub])

  useEffect(() => {
    return sub(
      (state) => state.next,
      (pressed) => {
        if (pressed) {
          setTab(currentTab => (currentTab + 1) % nbTabs)
        }
      }
    )
  }, [sub])

  return (
    <>
      {tab == 0 && <RainScene />}
      {tab == 1 && <SnowScene />}
    </>
  )
}

export default Experience
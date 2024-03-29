import { FC, useState, useEffect } from 'react'
import './logo-animation.css'

export const Logo: FC = () => {
  const [stroke, setStroke] = useState(5)
  const pageSize = {
    width: window.innerWidth / 2,
    height: window.innerHeight / 2,
  }
  const [translate] = useState({
    X: 0,
    Y: 0,
  })

  function handleMouseMove(ev: MouseEvent) {
    const offsetX = ev.pageX / pageSize.width - 1
    const offsetY = ev.pageY / pageSize.height - 1
    const ratio = Math.sqrt(offsetX * offsetX + offsetY * offsetY)
    setStroke(8 - 4 * ratio)
    // setTranslate({ X: offsetX * 4, Y: offsetY * 4 })
  }

  useEffect(() => {
    document.body.addEventListener('mousemove', handleMouseMove)

    return function cleanup() {
      document.body.removeEventListener('mousemove', handleMouseMove)
    }
  })

  return (
    <svg
      width='250'
      viewBox='0 0 216 79'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='logo'
      style={{ transform: `translate(${translate.X}px, ${translate.Y}px)` }}
    >
      <use href='#logo' stroke='#fff'></use>
      <use href='#logo' stroke='green' className='overlay'></use>

      <symbol id='logo'>
        <path
          d='M3 58.8378C17.3784 45.5946 30.2973 21.8108 30.2973 11.2703C30.2973 7.7027 28.1892 3 25.2162 3C15.4324 3 10.8378 66.027 10.8378 75.5405C11.8649 55.1622 24.8378 48.2432 30.2973 48.2432C35.1622 48.2432 38.7838 52.6216 38.7838 55.6487C38.7838 60.2432 37.1622 67.2703 25.6486 73.8649C33.2703 67.3243 39.2162 67.4324 48.8919 64.4054C59.5946 61.0541 71.1081 56.7838 71.1081 52.5135C71.1081 49.4865 69.3784 48.5135 65.3784 48.5135C61.4324 48.5135 55.8649 52.1351 55.8649 58.2432C55.8649 63.9189 62.027 68.4054 70.2432 68.4054C85.3784 68.4054 110.243 48.5676 110.243 28.4054C110.243 25.1622 108.676 21.2162 105.595 21.2162C100.081 21.2162 95.6486 36.7297 95.6486 53.1622C95.6486 63.3243 101.486 67.1081 107.054 67.1081C123.108 67.1081 133.811 33.1081 133.811 26.6216C133.811 21.6487 131.865 20.7838 130.351 20.7838C124.676 20.7838 121.649 34.4595 121.649 44.3514C121.649 57.5946 128.838 61.8108 139.216 61.8108C151.162 61.8108 162.459 51.7568 162.459 45.5405C162.459 42.2432 161.649 40.2432 159.162 40.2432C156.676 40.2432 151.811 46.2973 151.811 51C151.811 57.9189 159.054 61.2703 162.405 61.2703C173.595 61.2703 175.649 50.9459 200.297 50.9459C205.811 50.9459 209.324 51.3784 213 52.1351'
          strokeWidth={stroke || 4}
          strokeMiterlimit='10'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </symbol>
    </svg>
  )
}

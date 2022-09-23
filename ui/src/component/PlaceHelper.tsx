import { forwardRef, useImperativeHandle, useState } from 'react'

export type PlaceRefType = {
  getPlace: () => {x : number, y : number, length : number, width : number} | null
  doTranslate: (t : {x : number, y : number }) => Promise<void> | null
  doTranslate2: (t : {x : number, y : number }) => Promise<void> | null
}

const sleep = (milliseconds : number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const PlaceHelper = forwardRef<PlaceRefType, {
  children?: React.ReactNode | null
  selectedIndex?: number
  style?: any
  disable?: boolean
}>((props, ref) => {

  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });

  useImperativeHandle(ref, () => ({
      getPlace() {
        const dom = inputRef.current.getBoundingClientRect()
        return {
            x : dom.x,
            y : dom.y,
            length : dom.length,
            width : dom.width,
        }
      },
      async doTranslate(t : {x : number, y : number }) {
        setTranslate(t)
        await sleep(1000)
        setTranslate({
          x : 0,
          y : 0
        })
      },
      async doTranslate2(t : {x : number, y : number }) {
        setTranslate(t)
        await sleep(1000)
        setTranslate({
          x : 0,
          y : 0
        })
      }
    }));



  const inputRef = { current: null } as { current: any };

  let style = {
    ...props.style,
    transition: 'transform 1s',
    transform: `translateX(${translate.x}px) translateY(${translate.y}px)`,
    /* border: 'thin solid red', */
    width: '12em',
    marginLeft:"auto",
    marginRight:"auto",
  }

  if (props.disable) {
    style = {
      ...props.style,
      width: '12em',
      marginLeft:"auto",
      marginRight:"auto",
    }
  }

  return (
    <div ref={ref => inputRef.current = ref} style={style}
    >
      {props.children}
    </div>
  )

})

export default PlaceHelper

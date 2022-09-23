import { useDrag } from 'react-dnd'

function getItemStyles (currentOffset : any, isDragging : boolean) {
    const el = {
      borderRadius : '1em',
      height:'18em',
      width:'12em',
    }
    if (!isDragging || (currentOffset.x === 0 && currentOffset.y === 0)) {
        return {
            ...el,
            opacity: '.2',
            backgroundColor : 'green',

            //display: 'none'
        };
    }

    // http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
    var x = currentOffset.x;
    var y = currentOffset.y;
    var transform = `translate(${x}px, ${y}px)`;
    //console.log(currentOffset)

    return {
        ...el,
        //pointerEvents: 'none',
        transform: transform,
        WebkitTransform: transform,
        opacity: '.8',
        backgroundColor : 'red',
    };
}

export default function DragHelper(props : {
  data : any
  dropEffect : any
  children : any
}) {

  const [{ opacity, isDragging, currentOffset }, dragRef, dragPreview] = useDrag(
    () => ({
      type: "CARD",
      item: {data : props.data},
      collect: (monitor) => {
        //console.log(monitor.getSourceClientOffset())
        let currentOffset = monitor.getSourceClientOffset()
        let initialSourceClientOffset = monitor.getInitialSourceClientOffset()
        if (!currentOffset) {
          currentOffset = {
            x : 0,
            y : 0,
          }
        }
        if (!initialSourceClientOffset) {
          initialSourceClientOffset = {
            x : 0,
            y : 0,
          }
        }
        return ({
        opacity: monitor.isDragging() ? 0.5 : 1,
        isDragging: monitor.isDragging(),
        currentOffset: {x : currentOffset.x - initialSourceClientOffset.x , y : currentOffset.y - initialSourceClientOffset.y},

      })},
    }),
    []
  )

  /*
  <div ref={dragPreview}>
    <div style={{
    border : 'thin solid red',
    borderRadius : '1em',
    height:'2em',
    width:'2em',
  }}></div>
  </div>
  */
  /*
  if (isDragging) {
    return (
      <div ref={dragPreview} style={{position : 'absolute', top : '0px', left : '0px'}}>
        <div style={getItemStyles(currentOffset)}>
        <div style={{
        border : 'thin solid red',
        borderRadius : '1em',
        height:'2em',
        width:'2em',
      }}></div></div>
      </div>
    )
  }
  */

  return (
    <>
    <div ref={dragRef} style={{ opacity }} >
    <div ref={dragPreview} style={{
      pointerEvents : 'none',
      position: "absolute",
      ...getItemStyles(currentOffset, isDragging)
    }}>
    </div>
      {props.children}
    </div>
    </>
  )
  /*
  return (
    <div draggable
    onDragStart={startDrag}
    onTouchStart={startDrag2}
    //onTouchStart={startDrag}
    style={{border: "2px solid black", touchAction: 'none'}}
    >
      {props.children}
    </div>
  );
  */
}

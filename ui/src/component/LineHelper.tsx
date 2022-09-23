const LineHelper = (props: {
  x1 : number,
  y1 : number,
  x2 : number,
  y2 : number,
  color : string,
}) => {

  const width = props.x2 - props.x1
  const height = props.y2 - props.y1

  const length = Math.sqrt((width * width) + (height * height))

  const angle = (Math.atan2(height, width) * 1800) / (Math.PI * 10)

  //console.log(angle)

  return (
    <>
      <div style={{
        position: 'absolute',
        top: props.y1 - 2 + 'px',
        left: props.x1 + 2 + 'px',
        border : '2px solid ' + props.color,
        borderStyle: 'dashed',
        width: length + 'px',
        zIndex: 1,
        transform: 'rotate(' + angle + 'deg)',
        transformOrigin: '0 0',
        //transformOrigin: '20px 0',
        /*textAlign: 'center',
        fontSize: '40px',
        color: 'red',*/
      }}>
    </div>
  </>
  )

}

export default LineHelper

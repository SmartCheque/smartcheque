const RoundHelper = (props: {
  x : number,
  y : number,
  radius : number,
  color : string,
}) => {

  return (
    <>
      <div style={{
        position: 'absolute',
        top: props.y - props.radius + 'px',
        left: props.x - props.radius + 'px',
        borderRadius: '50%',
        border : '1px solid ' + props.color,
        width: props.radius * 2 + 'px',
        height: props.radius * 2 + 'px',
        zIndex: 1,
        backgroundColor: props.color,
        //transformOrigin: '0 0',
        //transformOrigin: '20px 0',
        /*textAlign: 'center',
        fontSize: '40px',
        color: 'red',*/
      }}>
    </div>
  </>
  )

}

export default RoundHelper

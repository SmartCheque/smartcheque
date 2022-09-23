const SpaceWidget = (props: { children: any }) => {
  return (
    <div className="d-flex justify-content-center" style={{paddingTop:'.5em', paddingBottom:'.5em'}}>
      <div>{props.children}</div>
      </div>
  )
}

export default SpaceWidget

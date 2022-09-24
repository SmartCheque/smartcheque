import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import SpaceWidget from './SpaceWidget'

const DivNice = (props:{
  title ?: any
  children ?: any
  style ?: any
}) => {
  return <Row className="justify-content-center" style={{margin : '1em'}}>
  <Col style={{
    backgroundColor : '#000000D0',
    color: 'white',
    borderRadius: '1em',
  }}>
  <SpaceWidget>
  <div style={{textAlign :'center'}}>
  <div style={props.style}>
  {!!props.title &&
    <h3>
      {props.title}
    </h3>
  }
  {props.children}
  </div>
  </div>
  </SpaceWidget>
  </Col>
  </Row>
}

export default DivNice

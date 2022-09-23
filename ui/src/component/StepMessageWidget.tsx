import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

import {
  StepType,
  Step
} from '../reducer/contractSlice'


const StepMessageWidget = (props : {
  step : StepType
  resetStep : () => void
}) => {

  let stepCaption

  switch (props.step.step) {
    case Step.Creating :
    stepCaption = 'Creating...'
    break
    case Step.Loading :
    stepCaption = 'Loading...'
    break
    case Step.Empty :
    stepCaption = 'Empty'
    break
    case Step.NotSet :
    stepCaption = 'Not set'
    break
    case Step.NotFound :
    stepCaption = 'Not found'
    break
  }

  if (props.step.message) {
    stepCaption = stepCaption + " " + props.step.message
  }

  return (<>
    {!!stepCaption &&
      <Alert variant='primary'>{stepCaption}</Alert>
    }
  { !!props.step.error &&
    <>
    <Alert variant='danger'>{props.step.error}</Alert>
    {props.resetStep &&
      <Button variant='danger' onClick={props.resetStep}>Ok</Button>
    }
    </>
  }
  </>)
}

export default StepMessageWidget

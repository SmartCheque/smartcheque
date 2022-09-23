import Button from 'react-bootstrap/Button'

import {
  StepType,
  Step
} from '../reducer/contractSlice'

//https://flatuicolors.com/palette/defo
const colorCarrot="#e67e22"
const colorEmerald="#2ecc71"
const colorTurquoise="#1abc9c"
const colorSilver="#bdc3c7"
const colorPomegranate="#c0392b"

const StepMessageNiceWidget = (props : {
  title : string
  step : StepType
  resetStep : () => void
}) => {

  let stepCaption

  let color = 'white'

  switch (props.step.step) {
    case Step.Creating :
    color=colorTurquoise
    stepCaption = 'Creating...'
    break
    case Step.Loading :
    color=colorTurquoise
    stepCaption = 'Loading...'
    break
    case Step.Joining:
    color=colorTurquoise
    stepCaption = 'Joining...'
    break
    case Step.Empty :
    color=colorCarrot
    stepCaption = 'Empty'
    break
    case Step.NotSet :
    color=colorCarrot
    stepCaption = 'Not set'
    break
    case Step.NotFound :
    color=colorCarrot
    stepCaption = 'Not found'
    break
    case Step.Ok :
    color=colorEmerald
    stepCaption = 'Ok'
    break
    case Step.Init :
    color=colorCarrot
    stepCaption = 'Waiting'
    break
    case Step.Error :
    color=colorPomegranate
    stepCaption = 'Error'
    break
    default :
    stepCaption = Step[props.step.step]
  }

  return (<>
    <div style={{color:color}}>{props.title} - {stepCaption}</div>
    <div style={{color:colorSilver}}>{props.step.message}</div>
  { !!props.step.error &&
    <div style={{color:colorPomegranate}}>
    <div>{props.step.error}</div>
    {props.resetStep &&
      <Button variant='danger' onClick={props.resetStep}>Ok</Button>
    }
    </div>
  }
  </>)
}

export default StepMessageNiceWidget

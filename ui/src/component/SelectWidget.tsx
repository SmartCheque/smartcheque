import Form from 'react-bootstrap/Form';

const SelectWidget = (props: {
  name?: string,
  value?: string,
  onChange: (event: any) => void,
  option: Array<{
    value: string,
    name: string,
  }>
}) => {

  const renderOption = (option: {
    value: string,
    name: string,
  }) => (
      <option key={option.value} value={option.value}>{option.name}</option>
    )

  return (
    <span>
      <Form.Control as="select" name={props.name} value={props.value} onChange={props.onChange}>
        {props.option.map(renderOption)}
      </Form.Control>
    </span>
  )
}

export default SelectWidget

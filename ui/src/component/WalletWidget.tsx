import AddressWidget from './AddressWidget'

// From Font Awesome
const circleIcon = (className: string) => (
  <svg viewBox='0 0 512 512' className={'circle-icon ' + className}>
    <path d='M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z' />
  </svg>
)

const WalletWidget = (props: {
  address?: string,
  error: string | undefined
}) => {

  const render = () => {

    if (!props.error) {
      return (
        <>
          <span className='is-family-monospace address'>
            {circleIcon('ok')}
            <AddressWidget address={props.address}/>
          </span>
        </>
      )
    } else {
      return (
        <>
          {circleIcon('warn')}
          {props.error}
        </>
      )
    }
  }

  return (
    <span id='wallet-widget'>
      {render()}
    </span>
  )
}


export default WalletWidget

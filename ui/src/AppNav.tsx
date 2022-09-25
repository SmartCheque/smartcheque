import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

import WalletWidget from './component/WalletWidget'

import { useAppSelector } from './hooks'

import { getStep, StepId } from './reducer/stateSlice'

const AppNav = (props: {
  section: string | undefined,
  setSection: (section : string) => void,
}) => {

  const step = useAppSelector((state) => state.stateSlice.step)
  const wallet = useAppSelector((state) => state.walletSlice.wallet)

  return (
    <Navbar
      fixed="top"
      variant="dark"
      style={{ backgroundColor:'#000000B0'}}
      collapseOnSelect
      expand="lg"
      >
    <Container fluid>
      <Navbar.Brand onClick={() => props.setSection('wallet')}>NFTEverywhere</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link onClick={() => props.setSection('wallet')}>Wallet</Nav.Link>
          <Nav.Link eventKey="1" onClick={() => props.setSection('user')}>User</Nav.Link>
          <Nav.Link eventKey="1" onClick={() => props.setSection('contractAdmin')}>contractAdmin</Nav.Link>
          <Nav.Link eventKey="1" onClick={() => props.setSection('collection')}>NFTs</Nav.Link>
        </Nav>
        <Nav className="mr-auto">
        </Nav>
      </Navbar.Collapse>
      <Navbar.Brand>
        <WalletWidget address={wallet.address} error={getStep(StepId.Wallet, step).error} />
      </Navbar.Brand>
      <Navbar.Brand>
      </Navbar.Brand>
      </Container>
    </Navbar>
  )
}

export default AppNav

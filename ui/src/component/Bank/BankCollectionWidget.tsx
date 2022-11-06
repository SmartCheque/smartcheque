import { useEffect, useState } from 'react'

import { NetworkType } from 'ethers-network/network'

import { Button } from 'react-bootstrap'

import { useAppDispatch, useAppSelector } from '../../hooks'

import { createBank } from '../../reducer/backend/contractSlice'

import BankWidget from './BankWidget'

const BankCollectionWidget = (props : {
  network : NetworkType,
  bankList : any
}) => {

  const dispatch = useAppDispatch()

  const isAdmin = useAppSelector((state) => state.authSlice.isAdmin)

  const [bankList, setBankList] = useState<Array<any> | undefined>()
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    const load = async () => {
      try {
        setBankList(await props.bankList.getCertificateList())
      } catch (error : any) {
        setError(error.toString())
      }
    }
    load()
  }, [props.bankList])

  console.log(bankList)

  if (error) {
    return <>{error}</>
  }
  if (!bankList) {
    return <>loading ...</>
  }
  return (
    <>
    {bankList.map(bank => {
      console.log(bank)

      return <div key={bank.certificate}>
          <BankWidget
            network={props.network}
            bank={bank}
            />
        </div>
  })}
  { !!isAdmin &&
    <Button onClick={() => {dispatch(createBank({
      chainId : props.network.chainId,
      name : "Bank",
    }))}}>Add bank</Button>
  }

    </>
  )
}

export default BankCollectionWidget

import UserSection from './UserSection'
import ContractAdminSection from './ContractAdminSection'
import CollectionSection from './CollectionSection'

const AdminSection = (props: {
  section : string | undefined,
})=> {

  const render = () => {
    switch (props.section){
      case 'user':
      return <UserSection/>
      case 'contractAdmin':
      return <ContractAdminSection/>
      case 'collection':
      return <CollectionSection/>
      default :
      return (<p></p>)
    }
  }

  return (
    <>
    {render()}
    </>
  )

}


export default AdminSection

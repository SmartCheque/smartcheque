import UserSection from './UserSection'
import ContractAdminSection from './ContractAdminSection'

const AdminSection = (props: {
  section : string | undefined,
})=> {

  const render = () => {
    switch (props.section){
      case 'user':
      return <UserSection/>
      case 'contractAdmin':
      return <ContractAdminSection/>
      default :
      return (<p>"Section not found " + {props.section}</p>)
    }
  }

  return (
    <>
    {render()}
    </>
  )

}


export default AdminSection

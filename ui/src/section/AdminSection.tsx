import UserSection from './UserSection'


const AdminSection = (props: {
  section : string | undefined,
})=> {

  const render = () => {
    switch (props.section){
      case 'user':
      return <UserSection/>
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

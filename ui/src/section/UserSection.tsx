import DivNice from '../component/DivNice'
import Login from '../component/user/Login'
import Profile from '../component/user/Profile'
import Register from '../component/user/Register'

const UserSection = ()=> {
  return <>
    <DivNice>user section</DivNice>
    <Profile/>
    <Login/>
    <Register/>
  </>
}

export default UserSection

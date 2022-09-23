import { useSelector } from 'react-redux';

import { RootState } from '../../store'

import DivNice from '../DivNice'

const Profile = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.authSlice);

  if (!currentUser) {
    return (
      <DivNice title='Profile'>No user</DivNice>
    )
  }

  const roles: Array<string> = currentUser.roles

  return (
    <DivNice title='Profile'>
      <p>
        <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p>
      <p>
        <strong>Id:</strong> {currentUser.id}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <strong>Authorities:</strong>
      <ul>
        {roles &&
          roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
    </DivNice>
  );
};

export default Profile;

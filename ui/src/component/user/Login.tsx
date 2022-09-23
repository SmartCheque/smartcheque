import { useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"

import { RootState } from '../../store'
import { useAppDispatch } from '../../hooks'

import { login } from "../../reducer/backend/authSlice"

import { useForm } from 'react-hook-form'
import DivNice from '../DivNice'

type LoginData = {
  email : string,
  password : string,
};

const Login = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const { pending, isLoggedIn } = useSelector((state : RootState) => state.authSlice);
  const { message } = useSelector((state : RootState) => state.messageSlice);

  const dispatch = useAppDispatch()
  const { t } = useTranslation();

  const handleLogin = (data : LoginData) => {
    dispatch(login({email : data.email, password : data.password}))
  };

  if (isLoggedIn){
    return (<></>)
  }

  return (
    <DivNice title='Login'>

        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="form-group">
            <label htmlFor="email">{t('user.email')}</label>
            <input
              type="text"
              className="form-control"
              {...register('email', { required: true })}
            />
            {errors.email &&
              <p>
                {t('field.isRequired', {field: t('user.email')})}
              </p>
            }
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('user.password')}</label>
            <input
              type="password"
              className="form-control"
              {...register('password', { required: true })}
            />
            {errors.password &&
              <p>
                {t('field.isRequired', {field: t('user.password')})}
              </p>
            }
          </div>

          <div className="form-group">
            <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
              {pending && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>{t('app.login')}</span>
            </button>
          </div>

          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
        </form>
    </DivNice>
  );
};

export default Login;

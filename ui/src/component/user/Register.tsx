import { useState } from "react"
import { useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"

import { RootState } from '../../store'
import { useAppDispatch } from '../../hooks'

import { useForm } from 'react-hook-form'

import { register as registerUser } from "../../reducer/backend/authSlice"
import DivNice from '../DivNice'

type DataRegister = {
  email: string,
  password: string,
}

const Register = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataRegister>()

  const [successful, setSuccessful] = useState(false)

  const { message } = useSelector((state: RootState) => state.messageSlice)

  const dispatch = useAppDispatch()
  const { t } = useTranslation();

  const handleRegister = (data: DataRegister) => {

    dispatch(registerUser({email : data.email, password : data.password}))
      .then(() => {
        setSuccessful(true)
      })
      .catch(() => {
        setSuccessful(false)
      })
  }

  return (
    <DivNice title='Register'>

        <form onSubmit={handleSubmit(handleRegister)}>
          {!successful && (
            <div>
              <div className="form-group">
                  <label htmlFor="email">{t('user.email')}</label>
                <input
                  type="text"
                  className="form-control"
                  {...register('email', {
                    required: true,
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Entered value does not match email format"
                    }
                  })}
                />
                {errors.email &&
                  <span role="alert">
                    {t('field.isRequired', {field: t('user.email')})}
                  </span>
                }
              </div>
              <div className="form-group">
                <label htmlFor="password">{t('user.password')}</label>
                <input
                  type="password"
                  className="form-control"
                  {...register("password", {
                    required: "required",
                    minLength: {
                      value: 5,
                      message: "min length is 5"
                    }
                  })}
                />
                {errors.password &&
                  <span role="alert">
                    {t('field.isRequired', {field: t('user.password')})}
                  </span>
                }
              </div>

              <div className="form-group">
                <button className="btn btn-primary btn-block" type="submit">
                  {t('app.register')}
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                {message}
              </div>
            </div>
          )}
        </form>
    </DivNice>
  )
}

export default Register

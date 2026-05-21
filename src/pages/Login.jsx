import React from 'react'
import {
  Button,
  Field,
  Flex,
  Input,
} from '@chakra-ui/react'

import { NavLink, useNavigate } from 'react-router'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import '../style/login.css'

import { loginUser } from '../service/authService'
import CustomToast from '../components/CustomToast'
import { setProfile } from '../store/profileSlice'
import { useDispatch } from 'react-redux'

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter email'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Please enter password'),
})

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogin = async (
    values,
    setSubmitting,
    resetForm
  ) => {
    try {
      const response = await loginUser(values)

      localStorage.setItem('authentication-token', response.token);
       dispatch(setProfile(response.user))
      CustomToast({
        title: 'Login Successful',
        description:
          response?.message ||
          'Welcome back 👋',
        type: 'success',
      })

      resetForm()

      window.location.replace('/')
    } catch (error) {
      console.log(error)

      CustomToast({
        title: 'Login Failed',
        description:
          error?.message ||
          'Invalid email or password',
        type: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Flex
      alignItems={'center'}
      justifyContent={'center'}
      className='main-login-container'
    >
      <div className='login-container'>
        <div className='circle1'></div>

        <div className='login-container-form'>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={LoginSchema}
            onSubmit={(
              values,
              { setSubmitting, resetForm }
            ) => {
              handleLogin(
                values,
                setSubmitting,
                resetForm
              )
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
            }) => (
              <Form className='form'>
                <h1 className='heading'>Login</h1>

                <h2 className='heading-helper'>
                  Login to track your expenses and
                  manage money smarter
                </h2>

                {/* Email */}
                <Field.Root
                  invalid={
                    errors.email &&
                    touched.email
                  }
                  required
                >
                  <Field.Label>
                    Email
                    <Field.RequiredIndicator />
                  </Field.Label>

                  <Input
                    type='email'
                    name='email'
                    placeholder='Enter your email'
                    className='input-login-page'
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  {errors.email &&
                    touched.email && (
                      <Field.ErrorText>
                        {errors.email}
                      </Field.ErrorText>
                    )}
                </Field.Root>

                {/* Password */}
                <Field.Root
                  invalid={
                    errors.password &&
                    touched.password
                  }
                  required
                >
                  <Field.Label>
                    Password
                    <Field.RequiredIndicator />
                  </Field.Label>

                  <Input
                    type='password'
                    name='password'
                    placeholder='Enter your password'
                    className='input-login-page'
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  {errors.password &&
                    touched.password && (
                      <Field.ErrorText>
                        {errors.password}
                      </Field.ErrorText>
                    )}
                </Field.Root>

                {/* Submit */}
                <Button
                  width={'100%'}
                  type='submit'
                  bg={'#8b5cf6'}
                  color={'white'}
                  loading={isSubmitting}
                  _hover={{
                    bg: '#7c3aed',
                  }}
                >
                  Login
                </Button>

                {/* Register */}
                <Flex justifyContent={'center'}>
                  <h4 className='register-helper'>
                    Don&apos;t Have Account?{' '}
                    <NavLink
                      to={'/register'}
                      className={'link'}
                    >
                      Register
                    </NavLink>
                  </h4>
                </Flex>
              </Form>
            )}
          </Formik>

          {/* Right Image */}
          <img
            src='https://images.unsplash.com/photo-1595513693496-ff2a21d4ee8b?q=80&w=719&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='login background'
          />
        </div>

        <div className='circle2'></div>
      </div>
    </Flex>
  )
}

export default Login
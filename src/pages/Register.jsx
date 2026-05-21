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

import {
  registerUser,
} from '../service/authService'

import CustomToast from '../components/CustomToast'

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(
      3,
      'Name must be at least 3 characters'
    )
    .required('Please enter name'),

  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter email'),

  password: Yup.string()
    .min(
      6,
      'Password must be at least 6 characters'
    )
    .required('Please enter password'),

  phone: Yup.string()
    .matches(
      /^[0-9]{10}$/,
      'Phone number must be 10 digits'
    )
    .required(
      'Please enter phone number'
    ),
})

function Register() {
  const navigate = useNavigate()

  const handleRegister = async (
    values,
    setSubmitting,
    resetForm
  ) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
      }

      const response =
        await registerUser(payload)

      CustomToast({
        title: 'Registration Successful',
        description:
          response?.message ||
          'Account created successfully 🎉',
        type: 'success',
      })

      resetForm()

      window.location.replace('/login')
    } catch (error) {
      console.log(error)

      CustomToast({
        title: 'Registration Failed',
        description:
          error?.message ||
          'Something went wrong',
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
      <div className='register-container'>
        <div className='circle1'></div>

        <div className='login-container-form'>
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              phone: '',
            }}
            validationSchema={
              RegisterSchema
            }
            onSubmit={(
              values,
              {
                setSubmitting,
                resetForm,
              }
            ) => {
              handleRegister(
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
                <h1 className='heading'>
                  Register
                </h1>

                <h2 className='heading-helper'>
                  Create your account and
                  manage your expenses
                  easily
                </h2>

                {/* Name */}
                <Field.Root
                  invalid={
                    errors.name &&
                    touched.name
                  }
                  required
                >
                  <Field.Label>
                    Name
                    <Field.RequiredIndicator />
                  </Field.Label>

                  <Input
                    type='text'
                    name='name'
                    placeholder='Enter your name'
                    className='input-login-page'
                    value={values.name}
                    onChange={
                      handleChange
                    }
                    onBlur={handleBlur}
                  />

                  {errors.name &&
                    touched.name && (
                      <Field.ErrorText>
                        {errors.name}
                      </Field.ErrorText>
                    )}
                </Field.Root>

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
                    onChange={
                      handleChange
                    }
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
                    onChange={
                      handleChange
                    }
                    onBlur={handleBlur}
                  />

                  {errors.password &&
                    touched.password && (
                      <Field.ErrorText>
                        {errors.password}
                      </Field.ErrorText>
                    )}
                </Field.Root>

                {/* Phone */}
                <Field.Root
                  invalid={
                    errors.phone &&
                    touched.phone
                  }
                  required
                >
                  <Field.Label>
                    Phone
                    <Field.RequiredIndicator />
                  </Field.Label>

                  <Input
                    type='text'
                    name='phone'
                    placeholder='Enter your phone number'
                    className='input-login-page'
                    value={values.phone}
                    onChange={
                      handleChange
                    }
                    onBlur={handleBlur}
                  />

                  {errors.phone &&
                    touched.phone && (
                      <Field.ErrorText>
                        {errors.phone}
                      </Field.ErrorText>
                    )}
                </Field.Root>

                {/* Submit */}
                <Button
                  width={'100%'}
                  type='submit'
                  bg={'#8b5cf6'}
                  color={'white'}
                  loading={
                    isSubmitting
                  }
                  _hover={{
                    bg: '#7c3aed',
                  }}
                >
                  Register
                </Button>

                {/* Login */}
                <Flex
                  justifyContent={
                    'center'
                  }
                >
                  <h4 className='register-helper'>
                    Already Have Account?{' '}
                    <NavLink
                      to={'/login'}
                      className={'link'}
                    >
                      Login
                    </NavLink>
                  </h4>
                </Flex>
              </Form>
            )}
          </Formik>

          {/* Right Side Image */}
          <img
            src='https://images.unsplash.com/photo-1595513693496-ff2a21d4ee8b?q=80&w=719&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='register background'
          />
        </div>

        <div className='circle2'></div>
      </div>
    </Flex>
  )
}

export default Register
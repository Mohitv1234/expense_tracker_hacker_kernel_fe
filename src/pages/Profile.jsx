import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

import { getProfile, updateProfile, changePassword } from '../service/userService'
import CustomToast from '../components/CustomToast'

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
})

const PasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
})

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await getProfile()
      if (res?.data) {
        setProfile(res.data)
      }
    } catch (error) {
      CustomToast({
        title: 'Error',
        description: 'Failed to load profile',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (values, { setSubmitting }) => {
    try {
      const res = await updateProfile(values)
      setProfile(res.data)
      CustomToast({
        title: 'Success',
        description: 'Profile updated successfully',
        type: 'success',
      })
    } catch (error) {
      CustomToast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        type: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChangePassword = async (values, { setSubmitting, resetForm }) => {
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })
      CustomToast({
        title: 'Success',
        description: 'Password changed successfully',
        type: 'success',
      })
      resetForm()
    } catch (error) {
      CustomToast({
        title: 'Error',
        description: error.message || 'Failed to change password',
        type: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <Box minH={'100vh'} bg={'#f6f1ff'} px={{ base: 4, md: 8 }} py={8}>
      <Flex justifyContent={'space-between'} alignItems={'center'} mb={8}>
        <Box>
          <Heading color={'#5b21b6'} size={'2xl'}>
            Profile Settings
          </Heading>
          <Text color={'gray.500'} mt={2}>
            Manage your personal information and security
          </Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
        {/* Personal Information */}
        <Box bg={'white'} p={8} rounded={'3xl'} boxShadow={'lg'} border={'1px solid #ede9fe'}>
          <Heading size={'lg'} color={'#5b21b6'} mb={6}>
            Personal Information
          </Heading>

          <Formik
            initialValues={{
              name: profile?.name || '',
              email: profile?.email || '',
            }}
            enableReinitialize
            validationSchema={ProfileSchema}
            onSubmit={handleUpdateProfile}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <VStack spacing={6} align="stretch" gap={5}>
                  <Field
                    invalid={errors.name && touched.name}
                    label="Full Name"
                    errorText={errors.name}
                  >
                    <Input
                      name="name"
                      placeholder="Enter your name"
                      bg={'gray.50'}
                      border={'1px solid #e5e7eb'}
                      rounded={'xl'}
                      h={'52px'}
                      px={4}
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      _focus={{
                        borderColor: '#8b5cf6',
                        boxShadow: '0 0 0 1px #8b5cf6',
                      }}
                    />
                  </Field>

                  <Field
                    invalid={errors.email && touched.email}
                    label="Email Address"
                    errorText={errors.email}
                  >
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      bg={'gray.50'}
                      border={'1px solid #e5e7eb'}
                      rounded={'xl'}
                      h={'52px'}
                      px={4}
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      _focus={{
                        borderColor: '#8b5cf6',
                        boxShadow: '0 0 0 1px #8b5cf6',
                      }}
                    />
                  </Field>

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    bg={'#8b5cf6'}
                    color={'white'}
                    rounded={'xl'}
                    h={'52px'}
                    mt={4}
                    _hover={{ bg: '#7c3aed' }}
                  >
                    Save Changes
                  </Button>
                </VStack>
              </Form>
            )}
          </Formik>
        </Box>

        {/* Security / Change Password */}
        <Box bg={'white'} p={8} rounded={'3xl'} boxShadow={'lg'} border={'1px solid #ede9fe'}>
          <Heading size={'lg'} color={'#5b21b6'} mb={6}>
            Security
          </Heading>

          <Formik
            initialValues={{
              oldPassword: '',
              newPassword: '',
              confirmPassword: '',
            }}
            validationSchema={PasswordSchema}
            onSubmit={handleChangePassword}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <VStack spacing={6} align="stretch" gap={5}>
                  <Field
                    invalid={errors.oldPassword && touched.oldPassword}
                    label="Current Password"
                    errorText={errors.oldPassword}
                  >
                    <Input
                      name="oldPassword"
                      type="password"
                      placeholder="Enter current password"
                      bg={'gray.50'}
                      border={'1px solid #e5e7eb'}
                      rounded={'xl'}
                      h={'52px'}
                      px={4}
                      value={values.oldPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      _focus={{
                        borderColor: '#8b5cf6',
                        boxShadow: '0 0 0 1px #8b5cf6',
                      }}
                    />
                  </Field>

                  <Field
                    invalid={errors.newPassword && touched.newPassword}
                    label="New Password"
                    errorText={errors.newPassword}
                  >
                    <Input
                      name="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      bg={'gray.50'}
                      border={'1px solid #e5e7eb'}
                      rounded={'xl'}
                      h={'52px'}
                      px={4}
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      _focus={{
                        borderColor: '#8b5cf6',
                        boxShadow: '0 0 0 1px #8b5cf6',
                      }}
                    />
                  </Field>

                  <Field
                    invalid={errors.confirmPassword && touched.confirmPassword}
                    label="Confirm New Password"
                    errorText={errors.confirmPassword}
                  >
                    <Input
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      bg={'gray.50'}
                      border={'1px solid #e5e7eb'}
                      rounded={'xl'}
                      h={'52px'}
                      px={4}
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      _focus={{
                        borderColor: '#8b5cf6',
                        boxShadow: '0 0 0 1px #8b5cf6',
                      }}
                    />
                  </Field>

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    bg={'white'}
                    color={'#8b5cf6'}
                    border={'1px solid #8b5cf6'}
                    rounded={'xl'}
                    h={'52px'}
                    mt={4}
                    _hover={{ bg: '#f5f3ff' }}
                  >
                    Change Password
                  </Button>
                </VStack>
              </Form>
            )}
          </Formik>
        </Box>
      </Grid>
    </Box>
  )
}
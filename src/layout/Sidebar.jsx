import React from 'react'
import {
  Box,
  Flex,
  Heading,
  Icon,
  Text,
  VStack,
  Button,
} from '@chakra-ui/react'

import {
  FiGrid,
  FiCreditCard,
  FiPieChart,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi'

import { NavLink } from 'react-router'
import LogoutConfirmation from '../components/LogoutConfirmation'

export default function Sidebar() {
  const menuItems = [
    {
      name: 'Dashboard',
      icon: FiGrid,
      path: '/',
    },
    {
      name: 'Transactions',
      icon: FiCreditCard,
      path: '/transactions',
    },
    {
      name: 'Reports',
      icon: FiPieChart,
      path: '/report',
    },
    {
      name: 'Budgets',
      icon: FiPieChart, // reusing pie chart or could import FiTarget
      path: '/budgets',
    },
    {
      name: 'Loans',
      icon: FiCreditCard, // reusing credit card or could import FiBriefcase
      path: '/loans',
    },
    {
      name: 'Master',
      icon: FiSettings,
      path: '/master',
    },
    {
      name: 'Profile',
      icon: FiSettings, // using settings icon for profile as it fits the context
      path: '/profile',
    },
  ]
  function handleLogout() {

  }
  return (
    <Box
      w={{ base: '90px', md: '270px' }}
      bg={'white'}
      borderRight={'1px solid #ede9fe'}
      p={5}
      h={'100vh'}
      position={'sticky'}
      top={0}
      boxShadow={'lg'}
    >
      {/* Logo */}
      <Flex
        alignItems={'center'}
        justifyContent={{
          base: 'center',
          md: 'flex-start',
        }}
        mb={10}
      >
        <Box
          w={'45px'}
          h={'45px'}
          rounded={'2xl'}
          bg={'#8b5cf6'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          color={'white'}
          fontWeight={'bold'}
          fontSize={'xl'}
        >
          ₹
        </Box>

        <Heading
          size={'md'}
          ml={3}
          color={'#5b21b6'}
          display={{ base: 'none', md: 'block' }}
        >
          ExpenseFlow
        </Heading>
      </Flex>

      {/* Menu */}
      <VStack gap={3} align={'stretch'}>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={{ width: '100%' }}
          >
            {({ isActive }) => (
              <Flex
                alignItems={'center'}
                gap={4}
                p={4}
                rounded={'2xl'}
                cursor={'pointer'}
                transition={'0.3s'}
                bg={
                  isActive
                    ? '#ede9fe'
                    : 'transparent'
                }
                color={
                  isActive
                    ? '#6d28d9'
                    : 'gray.600'
                }
                _hover={{
                  bg: '#f3e8ff',
                  color: '#6d28d9',
                }}
              >
                <Icon
                  as={item.icon}
                  boxSize={5}
                />

                <Text
                  fontWeight={'medium'}
                  display={{
                    base: 'none',
                    md: 'block',
                  }}
                >
                  {item.name}
                </Text>
              </Flex>
            )}
          </NavLink>
        ))}
      </VStack>

      {/* Bottom */}
      <Box
        position={'absolute'}
        bottom={6}
        left={5}
        right={5}
      >
        <LogoutConfirmation />
      </Box>
    </Box>
  )
}
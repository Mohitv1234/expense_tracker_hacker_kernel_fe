import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Progress,
  Table,
} from '@chakra-ui/react'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'

import { getDashboardStats, getMonthlyExpenseAnalytics } from '../service/dashboardService'
import AddTransactionDialog from '../components/AddTransaction'

export default function ExpenseDashboard() {
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    recentTransactions: []
  })
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        getDashboardStats(),
        getMonthlyExpenseAnalytics()
      ]);

      if (statsRes?.data) {
        setStats(statsRes.data);
      }

      if (analyticsRes?.data) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedAnalytics = analyticsRes.data.map(item => ({
          month: months[item.month - 1] || 'Unknown',
          expense: Number(item.total)
        }));
        setMonthlyData(formattedAnalytics);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    if(!localStorage.getItem('authentication-token')){
      window.location.replace('/login');
    } else {
      fetchDashboardData();
    }
  },[])

  const savings = Number(stats.totalIncome) - Number(stats.totalExpense);

  const cards = [
    {
      title: 'Total Balance',
      amount: `₹${Number(stats.totalBalance).toLocaleString()}`,
      change: '',
    },
    {
      title: 'Income',
      amount: `₹${Number(stats.totalIncome).toLocaleString()}`,
      change: '',
    },
    {
      title: 'Expenses',
      amount: `₹${Number(stats.totalExpense).toLocaleString()}`,
      change: '',
    },
    {
      title: 'Savings',
      amount: `₹${savings.toLocaleString()}`,
      change: '',
    },
  ]

  // Hardcoded for now until backend analytics supports these
  const weeklyData = [
    { day: 'Mon', amount: 4000 },
    { day: 'Tue', amount: 2500 },
    { day: 'Wed', amount: 5200 },
    { day: 'Thu', amount: 3100 },
    { day: 'Fri', amount: 6200 },
    { day: 'Sat', amount: 4100 },
    { day: 'Sun', amount: 7200 },
  ]

  const budgetData = [
    { name: 'Food', value: 40 },
    { name: 'Shopping', value: 25 },
    { name: 'Bills', value: 20 },
    { name: 'Travel', value: 15 },
  ]

  const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']

  return (
    <Box
      minH={'100vh'}
      bg={'#f6f1ff'}
      px={{ base: 4, md: 8 }}
      py={8}
    >
      {/* Header */}
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        mb={8}
        flexWrap={'wrap'}
        gap={4}
      >
        <Box>
          <Heading color={'#5b21b6'} size={'2xl'}>
            Expense Dashboard
          </Heading>

          <Text color={'gray.500'} mt={2}>
            Track your spending & savings easily
          </Text>
        </Box>

        <AddTransactionDialog 
          onSuccess={fetchDashboardData}
          title="Add Expense"
        />
      </Flex>

      {/* Cards */}
      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2,1fr)',
          xl: 'repeat(4,1fr)',
        }}
        gap={6}
      >
        {cards.map((item, index) => (
          <GridItem
            key={index}
            bg={'white'}
            p={6}
            rounded={'3xl'}
            boxShadow={'lg'}
            border={'1px solid #ede9fe'}
          >
            <Text color={'gray.500'} fontWeight={'medium'}>
              {item.title}
            </Text>

            <Flex justifyContent={'space-between'} mt={4}>
              <Heading color={'#5b21b6'} size={'lg'}>
                {item.amount}
              </Heading>

              {item.change && (
                <Box
                  px={3}
                  py={1}
                  rounded={'full'}
                  bg={
                    item.change.includes('+')
                      ? 'purple.100'
                      : 'red.100'
                  }
                  color={
                    item.change.includes('+')
                      ? 'purple.700'
                      : 'red.500'
                  }
                  fontSize={'sm'}
                  fontWeight={'bold'}
                  h={'fit-content'}
                >
                  {item.change}
                </Box>
              )}
            </Flex>
          </GridItem>
        ))}
      </Grid>

      {/* Charts */}
      <Grid
        mt={8}
        templateColumns={{
          base: '1fr',
          xl: '2fr 1fr',
        }}
        gap={6}
      >
        {/* Monthly Expenses */}
        <Box
          bg={'white'}
          p={6}
          rounded={'3xl'}
          boxShadow={'lg'}
          border={'1px solid #ede9fe'}
        >
          <Flex justifyContent={'space-between'} mb={6}>
            <Heading size={'lg'} color={'#5b21b6'}>
              Monthly Expenses
            </Heading>

            <Button
              size={'sm'}
              bg={'#ede9fe'}
              color={'#6d28d9'}
            >
              {new Date().getFullYear()}
            </Button>
          </Flex>

          <Box h={'320px'}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData.length ? monthlyData : [{month: 'No Data', expense: 0}]}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <Tooltip />

                <Bar
                  dataKey="expense"
                  fill="#8b5cf6"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Budget Pie Chart */}
        <Box
          bg={'white'}
          p={6}
          rounded={'3xl'}
          boxShadow={'lg'}
          border={'1px solid #ede9fe'}
        >
          <Heading size={'lg'} color={'#5b21b6'} mb={6}>
            Budget Overview
          </Heading>

          <Box h={'250px'}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                >
                  {budgetData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {budgetData.map((item, index) => (
            <Flex
              key={index}
              justifyContent={'space-between'}
              alignItems={'center'}
              mt={3}
            >
              <Flex alignItems={'center'} gap={2}>
                <Box
                  w={'12px'}
                  h={'12px'}
                  rounded={'full'}
                  bg={COLORS[index % COLORS.length]}
                />

                <Text color={'gray.600'}>
                  {item.name}
                </Text>
              </Flex>

              <Text fontWeight={'bold'}>
                {item.value}%
              </Text>
            </Flex>
          ))}
        </Box>
      </Grid>

      {/* Weekly Area Chart */}
      <Box
        mt={8}
        bg={'white'}
        p={6}
        rounded={'3xl'}
        boxShadow={'lg'}
        border={'1px solid #ede9fe'}
      >
        <Heading size={'lg'} color={'#5b21b6'} mb={6}>
          Weekly Spending
        </Heading>

        <Box h={'300px'}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient
                  id="colorExpense"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#8b5cf6"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#c4b5fd"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorExpense)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Transactions */}
      <Box
        mt={8}
        bg={'white'}
        p={6}
        rounded={'3xl'}
        boxShadow={'lg'}
        border={'1px solid #ede9fe'}
      >
        <Flex justifyContent={'space-between'} mb={6}>
          <Heading size={'lg'} color={'#5b21b6'}>
            Recent Transactions
          </Heading>

          <Button
            bg={'#ede9fe'}
            color={'#6d28d9'}
            onClick={() => window.location.href = '/transactions'}
          >
            View All
          </Button>
        </Flex>

        <Table.Root>
          <Table.Header bg={'#faf5ff'}>
            <Table.Row>
              <Table.ColumnHeader>
                Title
              </Table.ColumnHeader>

              <Table.ColumnHeader>
                Category
              </Table.ColumnHeader>

              <Table.ColumnHeader>
                Date
              </Table.ColumnHeader>

              <Table.ColumnHeader textAlign={'end'}>
                Amount
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {stats.recentTransactions.map((item, index) => {
                const isIncome = item.transaction_type_id === 1;
                return (
              <Table.Row key={index}>
                <Table.Cell>{item.title}</Table.Cell>

                <Table.Cell>{item.Category?.name || 'N/A'}</Table.Cell>

                <Table.Cell>{new Date(item.transaction_date).toLocaleDateString()}</Table.Cell>

                <Table.Cell
                  textAlign={'end'}
                  color={
                    isIncome
                      ? 'green.500'
                      : 'red.400'
                  }
                  fontWeight={'bold'}
                >
                  {isIncome ? '+' : '-'}₹{Number(item.amount).toLocaleString()}
                </Table.Cell>
              </Table.Row>
            )})}
            {stats.recentTransactions.length === 0 && (
                <Table.Row>
                    <Table.Cell colSpan={4} textAlign="center" color="gray.500">No recent transactions found.</Table.Cell>
                </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  )
}
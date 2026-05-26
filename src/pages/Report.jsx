import React, {
    useEffect,
    useState,
} from 'react'

import {
    Box,
    Button,
    Flex,
    Grid,
    Heading,
    Input,
    Spinner,
    Table,
    Tabs,
    Text,
} from '@chakra-ui/react'

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Bar,
} from 'recharts'

import { getMonthlyReport, getCategoryReport } from '../service/reportService'

const COLORS = [
    '#8b5cf6',
    '#a78bfa',
    '#c4b5fd',
    '#ddd6fe',
    '#7c3aed',
]

function Reports() {
    const [loading, setLoading] =
        useState(false)

    const [monthlyReport, setMonthlyReport] =
        useState({
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
            transactions: [],
        })

    const [categoryReport, setCategoryReport] =
        useState([])

    const [filters, setFilters] =
        useState({
            start_date:
                new Date()
                    .toISOString()
                    .split('T')[0]
                    .slice(0, 8) + '01',

            end_date: new Date()
                .toISOString()
                .split('T')[0],
        })

    // =====================================
    // MONTHLY REPORT
    // =====================================

    const fetchMonthlyReport =
        async () => {
            try {
                setLoading(true)
                const response = await getMonthlyReport(filters)
                setMonthlyReport(response.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

    // =====================================
    // CATEGORY REPORT
    // =====================================

    const fetchCategoryReport =
        async () => {
            try {
                const response = await getCategoryReport(filters)
                setCategoryReport(response.data)
                const formatted =
                    Object.entries(
                        response.data
                    ).map(
                        ([name, value]) => ({
                            name,
                            value,
                        })
                    )
                setCategoryReport(
                    formatted
                )
            } catch (error) {
                console.log(error)
            }
        }

    // =====================================
    // EXPORT CSV
    // =====================================

    const exportCSV = () => {
        const transactions =
            monthlyReport.transactions || []

        if (!transactions.length) {
            return
        }

        const headers = [
            'Date',
            'Category',
            'Account',
            'Type',
            'Amount',
        ]

        const rows = transactions.map(
            item => [
                item.transaction_date,
                item.Category?.name,
                item.Account?.name,
                item.TransactionType?.name,
                item.amount,
            ]
        )

        const csvContent = [
            headers.join(','),
            ...rows.map(row =>
                row.join(',')
            ),
        ].join('\n')

        const blob = new Blob(
            [csvContent],
            {
                type: 'text/csv;charset=utf-8;',
            }
        )

        const url =
            window.URL.createObjectURL(
                blob
            )

        const link =
            document.createElement('a')

        link.href = url

        link.setAttribute(
            'download',
            `expense-report-${Date.now()}.csv`
        )

        document.body.appendChild(link)

        link.click()

        document.body.removeChild(link)
    }

    useEffect(() => {
        fetchMonthlyReport()
        fetchCategoryReport()
    }, [])

    return (
        <Box
            p={6}
            bg={'#f6f1ff'}
            minH={'100vh'}
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
                    <Heading
                        size={'2xl'}
                        color={'#5b21b6'}
                    >
                        Reports & Analytics
                    </Heading>

                    <Text color={'gray.500'}>
                        Track your income and
                        expenses
                    </Text>
                </Box>

                <Button
                    padding={'10px 20px'}
                    bg={'#8b5cf6'}
                    color={'white'}
                    _hover={{
                        bg: '#7c3aed',
                    }}
                    rounded={'xl'}
                    onClick={exportCSV}
                >
                    Export CSV
                </Button>
            </Flex>

            {/* Filters */}
            <Flex
                gap={4}
                mb={8}
                flexWrap={'wrap'}
            >
                <Box>
                    <Text mb={2}>
                        Start Date
                    </Text>

                    <Input
                        padding={'10px'}
                        type='date'
                        bg={'white'}
                        value={filters.start_date}
                        onChange={e =>
                            setFilters({
                                ...filters,
                                start_date:
                                    e.target.value,
                            })
                        }
                    />
                </Box>

                <Box>
                    <Text mb={2}>
                        End Date
                    </Text>

                    <Input
                        padding={'10px'}
                        type='date'
                        bg={'white'}
                        value={filters.end_date}
                        onChange={e =>
                            setFilters({
                                ...filters,
                                end_date:
                                    e.target.value,
                            })
                        }
                    />
                </Box>

                <Button
                    padding={'10px 20px'}
                    alignSelf={'end'}
                    bg={'#8b5cf6'}
                    color={'white'}
                    rounded={'xl'}
                    _hover={{
                        bg: '#7c3aed',
                    }}
                    onClick={() => {
                        fetchMonthlyReport()
                        fetchCategoryReport()
                    }}
                >
                    Generate Report
                </Button>
            </Flex>

            {/* Tabs */}
            <Tabs.Root
                defaultValue='monthly'
            >
                <Tabs.List
                    bg={'white'}
                    p={'10px 20px'}
                    gap={7}
                    rounded={'2xl'}
                    border={
                        '1px solid #ede9fe'
                    }
                    mb={6}
                >
                    <Tabs.Trigger
                        value='monthly'
                    >
                        Monthly Report
                    </Tabs.Trigger>

                    <Tabs.Trigger
                        value='category'
                    >
                        Category Report
                    </Tabs.Trigger>
                </Tabs.List>

                {/* MONTHLY TAB */}
                <Tabs.Content value='monthly'>
                    {loading ? (
                        <Flex
                            justifyContent={'center'}
                            py={20}
                        >
                            <Spinner
                                size={'xl'}
                                color={'purple.500'}
                            />
                        </Flex>
                    ) : (
                        <>
                            {/* Stats */}
                            <Grid
                                templateColumns={{
                                    base: '1fr',
                                    md: 'repeat(3,1fr)',
                                }}
                                gap={6}
                                mb={8}
                            >
                                <Box
                                    bg={'white'}
                                    p={6}
                                    rounded={'3xl'}
                                    boxShadow={'lg'}
                                >
                                    <Text
                                        color={'gray.500'}
                                    >
                                        Total Income
                                    </Text>

                                    <Heading
                                        mt={3}
                                        color={'green.500'}
                                    >
                                        ₹
                                        {
                                            monthlyReport.totalIncome
                                        }
                                    </Heading>
                                </Box>

                                <Box
                                    bg={'white'}
                                    p={6}
                                    rounded={'3xl'}
                                    boxShadow={'lg'}
                                >
                                    <Text
                                        color={'gray.500'}
                                    >
                                        Total Expense
                                    </Text>

                                    <Heading
                                        mt={3}
                                        color={'red.400'}
                                    >
                                        ₹
                                        {
                                            monthlyReport.totalExpense
                                        }
                                    </Heading>
                                </Box>

                                <Box
                                    bg={'white'}
                                    p={6}
                                    rounded={'3xl'}
                                    boxShadow={'lg'}
                                >
                                    <Text
                                        color={'gray.500'}
                                    >
                                        Balance
                                    </Text>

                                    <Heading
                                        mt={3}
                                        color={'#5b21b6'}
                                    >
                                        ₹
                                        {
                                            monthlyReport.balance
                                        }
                                    </Heading>
                                </Box>
                            </Grid>

                            {/* Chart */}
                            <Box
                                bg={'white'}
                                p={6}
                                rounded={'3xl'}
                                boxShadow={'lg'}
                                mb={8}
                            >
                                <Heading
                                    size={'lg'}
                                    mb={6}
                                    color={'#5b21b6'}
                                >
                                    Income vs Expense
                                </Heading>

                                <Box h={'350px'}>
                                    <ResponsiveContainer
                                        width='100%'
                                        height='100%'
                                    >
                                        <BarChart
                                            data={[
                                                {
                                                    name:
                                                        'Income',
                                                    amount:
                                                        monthlyReport.totalIncome,
                                                },
                                                {
                                                    name:
                                                        'Expense',
                                                    amount:
                                                        monthlyReport.totalExpense,
                                                },
                                            ]}
                                        >
                                            <CartesianGrid strokeDasharray='3 3' />

                                            <XAxis dataKey='name' />

                                            <YAxis />

                                            <Tooltip />

                                            <Bar
                                                dataKey='amount'
                                                fill='#8b5cf6'
                                                radius={[
                                                    10,
                                                    10,
                                                    0,
                                                    0,
                                                ]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Box>

                            {/* Transactions */}
                            <Box
                                bg={'white'}
                                p={6}
                                rounded={'3xl'}
                                boxShadow={'lg'}
                            >
                                <Heading
                                    size={'lg'}
                                    mb={6}
                                    color={'#5b21b6'}
                                >
                                    Transactions
                                </Heading>

                                <Table.Root>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader>
                                                Date
                                            </Table.ColumnHeader>

                                            <Table.ColumnHeader>
                                                Category
                                            </Table.ColumnHeader>

                                            <Table.ColumnHeader>
                                                Account
                                            </Table.ColumnHeader>

                                            <Table.ColumnHeader>
                                                Type
                                            </Table.ColumnHeader>

                                            <Table.ColumnHeader textAlign='end'>
                                                Amount
                                            </Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body>
                                        {monthlyReport.transactions.map(
                                            item => (
                                                <Table.Row
                                                    key={item.id}
                                                >
                                                    <Table.Cell>
                                                        {
                                                            item.transaction_date
                                                        }
                                                    </Table.Cell>

                                                    <Table.Cell>
                                                        {
                                                            item.Category
                                                                ?.name
                                                        }
                                                    </Table.Cell>

                                                    <Table.Cell>
                                                        {
                                                            item.Account
                                                                ?.name
                                                        }
                                                    </Table.Cell>

                                                    <Table.Cell>
                                                        {
                                                            item
                                                                .TransactionType
                                                                ?.name
                                                        }
                                                    </Table.Cell>

                                                    <Table.Cell
                                                        textAlign='end'
                                                        fontWeight={
                                                            'bold'
                                                        }
                                                        color={
                                                            item
                                                                .TransactionType
                                                                ?.name ===
                                                                'Income' || (item
                                                                .TransactionType
                                                                ?.name ===
                                                                'Loan' && item.description == 'borrowed')
                                                                ? 'green.500'
                                                                : 'red.400'
                                                        }
                                                    >
                                                        ₹
                                                        {
                                                            item.amount
                                                        }
                                                    </Table.Cell>
                                                </Table.Row>
                                            )
                                        )}
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                        </>
                    )}
                </Tabs.Content>

                {/* CATEGORY TAB */}
                <Tabs.Content value='category'>
                    <Grid
                        templateColumns={{
                            base: '1fr',
                            xl: '1fr 1fr',
                        }}
                        gap={6}
                    >
                        {/* Pie Chart */}
                        <Box
                            bg={'white'}
                            p={6}
                            rounded={'3xl'}
                            boxShadow={'lg'}
                        >
                            <Heading
                                size={'lg'}
                                mb={6}
                                color={'#5b21b6'}
                            >
                                Expense Categories
                            </Heading>

                            <Box h={'400px'}>
                                <ResponsiveContainer
                                    width='100%'
                                    height='100%'
                                >
                                    <PieChart>
                                        <Pie
                                            data={
                                                categoryReport
                                            }
                                            dataKey='value'
                                            nameKey='name'
                                            outerRadius={140}
                                            innerRadius={80}
                                        >
                                            {categoryReport.map(
                                                (
                                                    item,
                                                    index
                                                ) => (
                                                    <Cell
                                                        key={
                                                            index
                                                        }
                                                        fill={
                                                            COLORS[
                                                            index %
                                                            COLORS.length
                                                            ]
                                                        }
                                                    />
                                                )
                                            )}
                                        </Pie>

                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </Box>

                        {/* Category List */}
                        <Box
                            bg={'white'}
                            p={6}
                            rounded={'3xl'}
                            boxShadow={'lg'}
                        >
                            <Heading
                                size={'lg'}
                                mb={6}
                                color={'#5b21b6'}
                            >
                                Breakdown
                            </Heading>

                            <Flex
                                direction={'column'}
                                gap={4}
                            >
                                {categoryReport.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <Flex
                                            key={index}
                                            justifyContent={
                                                'space-between'
                                            }
                                            alignItems={
                                                'center'
                                            }
                                            p={4}
                                            bg={
                                                '#faf5ff'
                                            }
                                            rounded={'2xl'}
                                        >
                                            <Flex
                                                alignItems={
                                                    'center'
                                                }
                                                gap={3}
                                            >
                                                <Box
                                                    w={'14px'}
                                                    h={'14px'}
                                                    rounded={
                                                        'full'
                                                    }
                                                    bg={
                                                        COLORS[
                                                        index %
                                                        COLORS.length
                                                        ]
                                                    }
                                                />

                                                <Text
                                                    fontWeight={
                                                        'medium'
                                                    }
                                                >
                                                    {
                                                        item.name
                                                    }
                                                </Text>
                                            </Flex>

                                            <Text
                                                fontWeight={
                                                    'bold'
                                                }
                                                color={
                                                    '#5b21b6'
                                                }
                                            >
                                                ₹
                                                {
                                                    item.value
                                                }
                                            </Text>
                                        </Flex>
                                    )
                                )}
                            </Flex>
                        </Box>
                    </Grid>
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    )
}

export default Reports
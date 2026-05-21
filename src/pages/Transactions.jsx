import React, {
    useEffect,
    useState,
} from 'react'

import {
    Box,
    Button,
    Flex,
    Heading,
    IconButton,
    Input,
    Spinner,
    Table,
    Text,
} from '@chakra-ui/react'

import {
    FiEdit,
    FiSearch,
    FiTrash2,
    FiPlus,
} from 'react-icons/fi'

import {
    deleteTransaction,
    getTransactions,
    searchTransactions,
} from '../service/transactionService'

import CustomToast from '../components/CustomToast'
import AddTransactionDialog from '../components/AddTransaction'

function Transactions() {
    const [loading, setLoading] =
        useState(false)

    const [transactions, setTransactions] =
        useState([])

    const [search, setSearch] =
        useState('')

    const [page, setPage] =
        useState(1)

    const [totalPages, setTotalPages] =
        useState(1)

    // =====================================
    // FETCH TRANSACTIONS
    // =====================================

    const fetchTransactions =
        async currentPage => {
            try {
                setLoading(true)

                const response =
                    await getTransactions(
                        currentPage,
                        10
                    )

                const data = response?.data?.data || response?.data || response || []
                setTransactions(Array.isArray(data) ? data : [])
                setTotalPages(response?.totalPages || response?.data?.totalPages || 1)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

    // =====================================
    // SEARCH TRANSACTIONS
    // =====================================

    const handleSearch =
        async value => {
            try {
                setSearch(value)

                if (!value) {
                    fetchTransactions(page)
                    return
                }

                const response =
                    await searchTransactions(
                        value
                    )

                const data = response?.data?.data || response?.data || response || []
                setTransactions(Array.isArray(data) ? data : [])
            } catch (error) {
                console.log(error)
            }
        }

    // =====================================
    // DELETE TRANSACTION
    // =====================================

    const handleDelete =
        async id => {
            const confirmDelete =
                window.confirm(
                    'Delete this transaction?'
                )

            if (!confirmDelete) return

            try {
                const response =
                    await deleteTransaction(
                        id
                    )

                if (response) {
                    CustomToast({
                        title: 'Success',
                        description:
                            response?.message || 'Transaction deleted successfully',
                        type: 'success',
                    })

                    fetchTransactions(page)
                }
            } catch (error) {
                console.log(error)
            }
        }

    useEffect(() => {
        fetchTransactions(page)
    }, [page])

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
                        color={'#5b21b6'}
                        size={'2xl'}
                    >
                        Transactions
                    </Heading>

                    <Text color={'gray.500'}>
                        Manage your transactions
                    </Text>
                </Box>

                <AddTransactionDialog onSuccess={() => fetchTransactions(page)} />
            </Flex>

            {/* Search */}
            <Flex
                mb={6}
                gap={4}
                alignItems={'center'}
            >
                <Box
                    position={'relative'}
                    w={{
                        base: '100%',
                        md: '350px',
                    }}
                >
                    <Input
                        placeholder='Search transaction...'
                        bg={'white'}
                        border={
                            '1px solid #ddd6fe'
                        }
                        rounded={'xl'}
                        pl={10}
                        value={search}
                        onChange={e =>
                            handleSearch(
                                e.target.value
                            )
                        }
                    />

                    <Box
                        position={'absolute'}
                        left={3}
                        top={'50%'}
                        transform={
                            'translateY(-50%)'
                        }
                        color={'gray.400'}
                    >
                        <FiSearch />
                    </Box>
                </Box>
            </Flex>

            {/* Table */}
            <Box
                bg={'white'}
                rounded={'3xl'}
                p={6}
                boxShadow={'lg'}
            >
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
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>
                                        Title
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

                                    <Table.ColumnHeader>
                                        Date
                                    </Table.ColumnHeader>

                                    <Table.ColumnHeader textAlign='end'>
                                        Amount
                                    </Table.ColumnHeader>

                                    <Table.ColumnHeader textAlign='center'>
                                        Actions
                                    </Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {transactions.map(
                                    item => (
                                        <Table.Row
                                            key={item.id}
                                        >
                                            <Table.Cell>
                                                {
                                                    item.title
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
                                                <Box
                                                    px={3}
                                                    py={1}
                                                    rounded={
                                                        'full'
                                                    }
                                                    w={
                                                        'fit-content'
                                                    }
                                                    bg={
                                                        item
                                                            .TransactionType
                                                            ?.name ===
                                                            'income'
                                                            ? '#dcfce7'
                                                            : '#fee2e2'
                                                    }
                                                    color={
                                                        item
                                                            .TransactionType
                                                            ?.name ===
                                                            'income'
                                                            ? 'green.600'
                                                            : 'red.500'
                                                    }
                                                    fontSize={
                                                        'sm'
                                                    }
                                                >
                                                    {
                                                        item
                                                            .TransactionType
                                                            ?.name
                                                    }
                                                </Box>
                                            </Table.Cell>

                                            <Table.Cell>
                                                {
                                                    item.transaction_date
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
                                                        'income'
                                                        ? 'green.500'
                                                        : 'red.400'
                                                }
                                            >
                                                ₹
                                                {
                                                    item.amount
                                                }
                                            </Table.Cell>

                                            <Table.Cell>
                                                <Flex
                                                    justifyContent={
                                                        'center'
                                                    }
                                                    gap={2}
                                                >
                                                    <AddTransactionDialog
                                                        onSuccess={() => fetchTransactions(page)}
                                                        initialData={item}
                                                        title="Edit Transaction"
                                                        triggerElement={
                                                            <IconButton
                                                                size='sm'
                                                                rounded={'xl'}
                                                                bg={'#ede9fe'}
                                                            >
                                                                <FiEdit />
                                                            </IconButton>
                                                        }
                                                    />

                                                    <IconButton
                                                        size='sm'
                                                        rounded={
                                                            'xl'
                                                        }
                                                        bg={
                                                            '#fee2e2'
                                                        }
                                                        color={
                                                            'red.500'
                                                        }
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <FiTrash2 />
                                                    </IconButton>
                                                </Flex>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                )}
                            </Table.Body>
                        </Table.Root>

                        {/* Pagination */}
                        <Flex
                            justifyContent={'end'}
                            mt={6}
                            gap={3}
                        >
                            <Button
                                padding={'5px 10px'}
                                size={'sm'}
                                rounded={'xl'}
                                disabled={
                                    page === 1
                                }
                                onClick={() =>
                                    setPage(
                                        prev =>
                                            prev - 1
                                    )
                                }
                            >
                                Previous
                            </Button>

                            <Text
                                alignSelf={'center'}
                            >
                                {page} /{' '}
                                {totalPages}
                            </Text>

                            <Button
                                padding={'5px 10px'}
                                size={'sm'}
                                rounded={'xl'}
                                disabled={
                                    page ===
                                    totalPages
                                }
                                onClick={() =>
                                    setPage(
                                        prev =>
                                            prev + 1
                                    )
                                }
                            >
                                Next
                            </Button>
                        </Flex>
                    </>
                )}
            </Box>
        </Box>
    )
}

export default Transactions
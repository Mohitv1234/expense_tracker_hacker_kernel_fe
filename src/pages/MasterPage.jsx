import React, { useEffect, useState } from 'react'

import {
    Badge,
    Box,
    Button,
    Card,
    createListCollection,
    Field,
    Flex,
    Grid,
    Heading,
    HStack,
    IconButton,
    Input,
    Select,
    Spinner,
    Stack,
    Table,
    Tabs,
    Text,
    VStack,
} from '@chakra-ui/react'

import { ArrowDownLeft, ArrowUpRight, Plus, Repeat, Trash2, Wallet } from 'lucide-react'

import {
    createAccount,
    createCategory,
    createTransactionType,
    deleteAccount,
    deleteCategory,
    getAccounts,
    getCategories,
    getTransactionTypes,
} from '../service/masterService'

import {
    createTag,
    getTags,
    deleteTag
} from '../service/tagService'

const accountType = createListCollection({
    items: [
        { label: 'Cash', value: 'cash' },
        { label: 'Bank', value: 'bank' },
        { label: 'UPI', value: 'upi' },
        {
            label: 'Credit Card',
            value: 'credit_card',
        },
        { label: 'Wallet', value: 'wallet' },
    ],
})

function Master() {
    const [loading, setLoading] =
        useState(false)

    const [btnLoading, setBtnLoading] =
        useState(false)

    const [activeTab, setActiveTab] =
        useState('accounts')

    const [accounts, setAccounts] =
        useState([])

    const [categories, setCategories] =
        useState([])

    const [
        transactionTypes,
        setTransactionTypes,
    ] = useState([])
    const [
        transactionTypesSuggestion,
        setTransactionTypesSuggestion,
    ] = useState(
        createListCollection({
            items: [],
        })
    )

    const [tags, setTags] = useState([])

    // =================================
    // FORMS
    // =================================
    const [
        transactionTypeForm,
        setTransactionTypeForm,
    ] = useState({
        name: '',
    })
    const [accountForm, setAccountForm] =
        useState({
            name: '',
            account_type: [],
            balance: '',
        })

    const [
        categoryForm,
        setCategoryForm,
    ] = useState({
        name: '',
        type: '',
    })

    const [tagForm, setTagForm] = useState({
        name: ''
    })

    // =================================
    // FETCH ACCOUNTS
    // =================================

    const fetchAccounts = async () => {
        try {
            setLoading(true)

            const res = await getAccounts()

            console.log(
                'Accounts Response:',
                res
            )

            setAccounts(
                res?.data?.data ||
                res?.data ||
                []
            )
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // =================================
    // FETCH CATEGORIES
    // =================================
    const handleCreateTransactionType =
        async () => {
            if (!transactionTypeForm.name) {
                alert(
                    'Please enter transaction type'
                )
                return
            }

            try {
                setBtnLoading(true)
                await createTransactionType(transactionTypeForm)

                setTransactionTypeForm({
                    name: '',
                })
                
                fetchTransactionTypes()
            } catch (error) {
                console.log(error)
            } finally {
                setBtnLoading(false)
            }
        }
    const fetchCategories = async () => {
        try {
            setLoading(true)

            const res =
                await getCategories()

            setCategories(
                res?.data?.data ||
                res?.data ||
                []
            )
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // =================================
    // FETCH TRANSACTION TYPES
    // =================================

    const fetchTransactionTypes =
        async () => {
            try {
                setLoading(true)

                const res =
                    await getTransactionTypes()

                const data = res?.data?.data || res?.data || []
                
                setTransactionTypes(data)
                
                setTransactionTypesSuggestion(
                    createListCollection({
                        items: data.map(item => ({
                            label: item.name,
                            value: String(item.id),
                        })),
                    })
                )
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

    // =================================
    // FETCH TAGS
    // =================================

    const fetchTags = async () => {
        try {
            setLoading(true)
            const res = await getTags()
            setTags(res?.data?.data || res?.data || [])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // =================================
    // TAB WISE FETCH
    // =================================

    useEffect(() => {
        if (activeTab === 'accounts') {
            fetchAccounts()
        }

        if (
            activeTab === 'categories'
        ) {
            fetchCategories()
            fetchTransactionTypes()
        }

        if (
            activeTab ===
            'transactions'
        ) {
            fetchTransactionTypes()
        }
        if (activeTab === 'tags') {
            fetchTags()
        }
    }, [activeTab])

    // =================================
    // CREATE ACCOUNT
    // =================================

    const handleCreateAccount =
        async () => {
            if (
                !accountForm.name ||
                !accountForm.account_type
                    .length
            ) {
                alert(
                    'Please fill all account details'
                )
                return
            }

            try {
                setBtnLoading(true)

                await createAccount({
                    name: accountForm.name,
                    account_type:
                        accountForm
                            .account_type[0],
                    balance: Number(
                        accountForm.balance ||
                        0
                    ),
                })

                setAccountForm({
                    name: '',
                    account_type: [],
                    balance: '',
                })

                fetchAccounts()
            } catch (error) {
                console.log(error)
            } finally {
                setBtnLoading(false)
            }
        }

    // =================================
    // CREATE CATEGORY
    // =================================

    const handleCreateCategory =
        async () => {
            if (
                !categoryForm.name ||
                !categoryForm.transaction_type_id
            ) {
                alert(
                    'Please fill category details'
                )
                return
            }

            try {
                setBtnLoading(true)

                await createCategory({
                    name: categoryForm.name,
                    type: categoryForm.type,
                    transaction_type_id: categoryForm.transaction_type_id ? categoryForm.transaction_type_id[0] : undefined
                })

                setCategoryForm({
                    name: '',
                    type: '',
                    transaction_type_id: []
                })

                fetchCategories()
            } catch (error) {
                console.log(error)
            } finally {
                setBtnLoading(false)
            }
        }

    // =================================
    // DELETE ACCOUNT
    // =================================

    const handleDeleteAccount =
        async id => {
            const confirmDelete =
                window.confirm(
                    'Delete this account?'
                )

            if (!confirmDelete) return

            try {
                await deleteAccount(id)

                fetchAccounts()
            } catch (error) {
                console.log(error)
            }
        }

    // =================================
    // DELETE CATEGORY
    // =================================

    const handleDeleteCategory =
        async id => {
            const confirmDelete =
                window.confirm(
                    'Delete this category?'
                )

            if (!confirmDelete) return

            try {
                await deleteCategory(id)

                fetchCategories()
            } catch (error) {
                console.log(error)
            }
        }

    // =================================
    // CREATE TAG
    // =================================

    const handleCreateTag = async () => {
        if (!tagForm.name) {
            alert('Please enter tag name')
            return
        }

        try {
            setBtnLoading(true)
            await createTag({ name: tagForm.name })
            setTagForm({ name: '' })
            fetchTags()
        } catch (error) {
            console.log(error)
        } finally {
            setBtnLoading(false)
        }
    }

    // =================================
    // DELETE TAG
    // =================================

    const handleDeleteTag = async id => {
        const confirmDelete = window.confirm('Delete this tag?')
        if (!confirmDelete) return

        try {
            await deleteTag(id)
            fetchTags()
        } catch (error) {
            console.log(error)
        }
    }

    // =================================
    // LOADER
    // =================================

    if (loading) {
        return (
            <Flex
                h='80vh'
                justify='center'
                align='center'
            >
                <Spinner
                    size='xl'
                    color='purple.500'
                />
            </Flex>
        )
    }

    return (
        <Box
            p={{
                base: 4,
                md: 6,
                lg: 8,
            }}
            bg='gray.50'
            minH='100vh'
        >
            {/* HEADER */}

            <Flex
                justify='space-between'
                align='center'
                mb={6}
                flexWrap='wrap'
                gap={4}
            >
                <Box>
                    <Heading
                        size='xl'
                        color='purple.700'
                    >
                        Master Management
                    </Heading>

                    <Text
                        mt={1}
                        color='gray.500'
                    >
                        Manage accounts,
                        categories and
                        transaction types
                    </Text>
                </Box>

                <HStack gap={3}>
                    <Card.Root
                        p={3}
                        rounded='xl'
                        bg='white'
                        shadow='sm'
                    >
                        <HStack>
                            <Text color='gray.500'>
                                Accounts
                            </Text>

                            <Badge colorPalette='purple'>
                                {
                                    accounts.length
                                }
                            </Badge>
                        </HStack>
                    </Card.Root>

                    <Card.Root
                        p={3}
                        rounded='xl'
                        bg='white'
                        shadow='sm'
                    >
                        <HStack>
                            <Text color='gray.500'>
                                Categories
                            </Text>

                            <Badge colorPalette='green'>
                                {
                                    categories.length
                                }
                            </Badge>
                        </HStack>
                    </Card.Root>

                    <Card.Root
                        p={3}
                        rounded='xl'
                        bg='white'
                        shadow='sm'
                    >
                        <HStack>
                            <Text color='gray.500'>
                                Tags
                            </Text>

                            <Badge colorPalette='blue'>
                                {
                                    tags.length
                                }
                            </Badge>
                        </HStack>
                    </Card.Root>
                </HStack>
            </Flex>

            {/* TABS */}

            <Tabs.Root
                value={activeTab}
                onValueChange={e =>
                    setActiveTab(e.value)
                }
                variant='outline'
                fitted
            >
                <Tabs.List
                    bg='white'
                    rounded='xl'
                    p={2}
                    mb={6}
                    shadow='sm'
                >
                    <Tabs.Trigger
                        value='accounts'
                        rounded='lg'
                    >
                        Accounts
                    </Tabs.Trigger>

                    <Tabs.Trigger
                        value='categories'
                        rounded='lg'
                    >
                        Categories
                    </Tabs.Trigger>


                    <Tabs.Trigger
                        value='tags'
                        rounded='lg'
                    >
                        Tags
                    </Tabs.Trigger>
                </Tabs.List>

                {/* ================================= */}
                {/* ACCOUNTS TAB */}
                {/* ================================= */}

                <Tabs.Content value='accounts'>
                    <Grid
                        templateColumns={{
                            base: '1fr',
                            xl: '350px 1fr',
                        }}
                        gap={6}
                    >
                        {/* FORM */}

                        <Card.Root
                            bg='white'
                            rounded='2xl'
                            shadow='sm'
                            p={6}
                        >
                            <Card.Header
                                p={0}
                                mb={6}
                            >
                                <HStack>
                                    <Wallet
                                        size={20}
                                    />

                                    <Heading
                                        size='md'
                                        color='purple.700'
                                    >
                                        Create
                                        Account
                                    </Heading>
                                </HStack>
                            </Card.Header>

                            <Card.Body p={0}>
                                <Stack gap={5}>
                                    <Field.Root>
                                        <Field.Label>
                                            Account
                                            Name
                                        </Field.Label>

                                        <Input
                                            h='48px'
                                            bg='gray.50'
                                            placeholder='Enter account name'
                                            value={
                                                accountForm.name
                                            }
                                            onChange={e =>
                                                setAccountForm(
                                                    {
                                                        ...accountForm,
                                                        name: e
                                                            .target
                                                            .value,
                                                    }
                                                )
                                            }
                                        />
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>
                                            Account
                                            Type
                                        </Field.Label>

                                        <Select.Root
                                            collection={
                                                accountType
                                            }
                                            value={
                                                accountForm.account_type
                                            }
                                            onValueChange={e =>
                                                setAccountForm(
                                                    {
                                                        ...accountForm,
                                                        account_type:
                                                            e.value,
                                                    }
                                                )
                                            }
                                        >
                                            <Select.HiddenSelect />

                                            <Select.Control>
                                                <Select.Trigger
                                                    h='48px'
                                                    bg='gray.50'
                                                    rounded='lg'
                                                >
                                                    <Select.ValueText placeholder='Select type' />
                                                </Select.Trigger>
                                            </Select.Control>

                                            <Select.Positioner>
                                                <Select.Content rounded='lg'>
                                                    {accountType.items.map(
                                                        item => (
                                                            <Select.Item
                                                                item={
                                                                    item
                                                                }
                                                                key={
                                                                    item.value
                                                                }
                                                            >
                                                                {
                                                                    item.label
                                                                }
                                                            </Select.Item>
                                                        )
                                                    )}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Select.Root>
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>
                                            Opening
                                            Balance
                                        </Field.Label>

                                        <Input
                                            h='48px'
                                            bg='gray.50'
                                            type='number'
                                            placeholder='0.00'
                                            value={
                                                accountForm.balance
                                            }
                                            onChange={e =>
                                                setAccountForm(
                                                    {
                                                        ...accountForm,
                                                        balance:
                                                            e
                                                                .target
                                                                .value,
                                                    }
                                                )
                                            }
                                        />
                                    </Field.Root>

                                    <Button
                                        h='48px'
                                        rounded='lg'
                                        bg='purple.600'
                                        color='white'
                                        loading={
                                            btnLoading
                                        }
                                        _hover={{
                                            bg: 'purple.700',
                                        }}
                                        onClick={
                                            handleCreateAccount
                                        }
                                    >
                                        Create
                                        Account
                                    </Button>
                                </Stack>
                            </Card.Body>
                        </Card.Root>

                        {/* TABLE */}

                        <Card.Root
                            bg='white'
                            rounded='2xl'
                            shadow='sm'
                            overflow='hidden'
                        >
                            <Card.Header p={6}>
                                <Heading
                                    size='md'
                                    color='purple.700'
                                >
                                    Accounts
                                </Heading>
                            </Card.Header>

                            <Card.Body p={0}>
                                <Box overflowX='auto'>
                                    <Table.Root>
                                        <Table.Header bg='gray.50'>
                                            <Table.Row>
                                                <Table.ColumnHeader px={6}>
                                                    Name
                                                </Table.ColumnHeader>

                                                <Table.ColumnHeader>
                                                    Type
                                                </Table.ColumnHeader>

                                                <Table.ColumnHeader>
                                                    Balance
                                                </Table.ColumnHeader>

                                                <Table.ColumnHeader textAlign='center'>
                                                    Action
                                                </Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>

                                        <Table.Body>
                                            {accounts.length >
                                                0 ? (
                                                accounts.map(
                                                    item => (
                                                        <Table.Row
                                                            key={
                                                                item.id
                                                            }
                                                        >
                                                            <Table.Cell px={6}>
                                                                {
                                                                    item.name
                                                                }
                                                            </Table.Cell>

                                                            <Table.Cell>
                                                                <Badge colorPalette='purple' p={'3px 10px'}>
                                                                    {
                                                                        item.account_type
                                                                    }
                                                                </Badge>
                                                            </Table.Cell>

                                                            <Table.Cell>
                                                                ₹
                                                                {
                                                                    item.balance
                                                                }
                                                            </Table.Cell>

                                                            <Table.Cell textAlign='center'>
                                                                <IconButton
                                                                    size='sm'
                                                                    colorPalette='red'
                                                                    variant='subtle'
                                                                    rounded='lg'
                                                                    bg={'none'}
                                                                    onClick={() =>
                                                                        handleDeleteAccount(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 size={16} />
                                                                </IconButton>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    )
                                                )
                                            ) : (
                                                <Table.Row>
                                                    <Table.Cell
                                                        colSpan={
                                                            4
                                                        }
                                                        textAlign='center'
                                                        py={
                                                            10
                                                        }
                                                    >
                                                        No
                                                        Accounts
                                                        Found
                                                    </Table.Cell>
                                                </Table.Row>
                                            )}
                                        </Table.Body>
                                    </Table.Root>
                                </Box>
                            </Card.Body>
                        </Card.Root>
                    </Grid>
                </Tabs.Content>

                {/* ================================= */}
                {/* CATEGORIES TAB */}
                {/* ================================= */}

                <Tabs.Content value='categories'>
                    <Grid
                        templateColumns={{
                            base: '1fr',
                            xl: '350px 1fr',
                        }}
                        gap={6}
                    >
                        {/* FORM */}

                        <Card.Root
                            bg='white'
                            rounded='2xl'
                            shadow='sm'
                            p={6}
                        >
                            <Card.Header
                                p={0}
                                mb={6}
                            >
                                <Heading
                                    size='md'
                                    color='purple.700'
                                >
                                    Create Category
                                </Heading>
                            </Card.Header>

                            <Card.Body p={0}>
                                <Stack gap={5}>
                                    <Field.Root>
                                        <Field.Label>
                                            Category Name
                                        </Field.Label>

                                        <Input
                                            h='48px'
                                            placeholder='Food, Travel, Salary'
                                            value={
                                                categoryForm.name
                                            }
                                            onChange={e =>
                                                setCategoryForm({
                                                    ...categoryForm,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>
                                            Transaction Type
                                        </Field.Label>

                                        <Select.Root
                                            collection={transactionTypesSuggestion}
                                            value={
                                                categoryForm.transaction_type_id || []
                                            }
                                            onValueChange={e =>
                                                setCategoryForm({
                                                    ...categoryForm,
                                                    transaction_type_id:
                                                        e.value,
                                                })
                                            }
                                        >
                                            <Select.HiddenSelect />

                                            <Select.Control>
                                                <Select.Trigger
                                                    h='48px'
                                                    bg='gray.50'
                                                    rounded='lg'
                                                >
                                                    <Select.ValueText placeholder='Select type' />
                                                </Select.Trigger>
                                            </Select.Control>

                                            <Select.Positioner>
                                                <Select.Content rounded='lg'>
                                                    {transactionTypesSuggestion.items.map(
                                                        item => (
                                                            <Select.Item
                                                                item={item}
                                                                key={item.value}
                                                            >
                                                                {item.label}
                                                            </Select.Item>
                                                        )
                                                    )}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Select.Root>
                                    </Field.Root>

                                    <Button
                                        h='48px'
                                        rounded='lg'
                                        bg='purple.600'
                                        color='white'
                                        loading={btnLoading}
                                        _hover={{
                                            bg: 'purple.700',
                                        }}
                                        onClick={
                                            handleCreateCategory
                                        }
                                    >
                                        Create Category
                                    </Button>
                                </Stack>
                            </Card.Body>
                        </Card.Root>

                        {/* TABLE */}

                        <Card.Root
                            bg='white'
                            rounded='2xl'
                            shadow='sm'
                            overflow='hidden'
                        >
                            <Card.Header p={6}>
                                <Heading
                                    size='md'
                                    color='purple.700'
                                >
                                    Categories
                                </Heading>
                            </Card.Header>

                            <Card.Body p={0}>
                                <Box overflowX='auto'>
                                    <Table.Root>
                                        <Table.Header bg='gray.50'>
                                            <Table.Row>
                                                <Table.ColumnHeader px={6}>
                                                    Name
                                                </Table.ColumnHeader>

                                                <Table.ColumnHeader>
                                                    Type
                                                </Table.ColumnHeader>

                                                <Table.ColumnHeader textAlign='center'>
                                                    Action
                                                </Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>

                                        <Table.Body>
                                            {categories.length >
                                                0 ? (
                                                categories.map(
                                                    item => (
                                                        <Table.Row
                                                            key={
                                                                item.id
                                                            }
                                                            _hover={{
                                                                bg: 'gray.50',
                                                            }}
                                                        >
                                                            <Table.Cell px={6}>
                                                                <Text fontWeight='600'>
                                                                    {
                                                                        item.name
                                                                    }
                                                                </Text>
                                                            </Table.Cell>

                                                            <Table.Cell>
                                                                <Badge
                                                                    colorPalette={
                                                                        item.TransactionType?.name ===
                                                                            'Income' ? 'green' : item.TransactionType?.name ===
                                                                            'Expense' ? 'red'
                                                                            : 'blue'
                                                                    }
                                                                >
                                                                    {
                                                                        item?.TransactionType?.name
                                                                    }
                                                                </Badge>
                                                            </Table.Cell>

                                                            <Table.Cell textAlign='center'>
                                                                <IconButton
                                                                    size='sm'
                                                                    colorPalette='red'
                                                                    variant='subtle'
                                                                    rounded='lg'
                                                                    onClick={() =>
                                                                        handleDeleteCategory(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 size={16} />
                                                                </IconButton>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    )
                                                )
                                            ) : (
                                                <Table.Row>
                                                    <Table.Cell
                                                        colSpan={3}
                                                        textAlign='center'
                                                        py={10}
                                                    >
                                                        No Categories Found
                                                    </Table.Cell>
                                                </Table.Row>
                                            )}
                                        </Table.Body>
                                    </Table.Root>
                                </Box>
                            </Card.Body>
                        </Card.Root>
                    </Grid>
                </Tabs.Content>

                {/* ================================= */}
                {/* TRANSACTION TAB */}
                {/* ================================= */}

                <Tabs.Content value='transactions'>
                    <Grid
                        templateColumns={{
                            base: '1fr',
                            xl: '350px 1fr',
                        }}
                        gap={6}
                    >
                        {/* LEFT FORM */}

                        <Card.Root
                            bg='white'
                            rounded='3xl'
                            shadow='sm'
                            border='1px solid'
                            borderColor='gray.100'
                            overflow='hidden'
                        >
                            <Box
                                h='6px'
                                bg='purple.500'
                            />

                            <Card.Body p={6}>
                                <VStack
                                    align='stretch'
                                    gap={6}
                                >
                                    <Box>
                                        <Heading
                                            size='md'
                                            color='purple.700'
                                        >
                                            Add Transaction Type
                                        </Heading>

                                        <Text
                                            mt={1}
                                            fontSize='sm'
                                            color='gray.500'
                                        >
                                            Create custom
                                            transaction types
                                            for your expense
                                            system
                                        </Text>
                                    </Box>

                                    <Field.Root>
                                        <Field.Label>
                                            Transaction Type
                                        </Field.Label>

                                        <Input
                                            h='52px'
                                            bg='gray.50'
                                            border='1px solid'
                                            borderColor='gray.200'
                                            rounded='xl'
                                            placeholder='Expense, Income, Transfer'
                                            value={
                                                transactionTypeForm.name
                                            }
                                            onChange={e =>
                                                setTransactionTypeForm(
                                                    {
                                                        name: e.target.value,
                                                    }
                                                )
                                            }
                                            _focus={{
                                                borderColor:
                                                    'purple.400',
                                                boxShadow:
                                                    '0 0 0 1px #805AD5',
                                            }}
                                        />
                                    </Field.Root>

                                    <Button
                                        h='52px'
                                        rounded='xl'
                                        bg='purple.600'
                                        color='white'
                                        fontWeight='600'
                                        loading={btnLoading}
                                        _hover={{
                                            bg: 'purple.700',
                                            transform:
                                                'translateY(-2px)',
                                        }}
                                        transition='0.2s'
                                        onClick={
                                            handleCreateTransactionType
                                        }
                                    >
                                        <Plus size={18} />

                                        Add Transaction Type
                                    </Button>
                                </VStack>
                            </Card.Body>
                        </Card.Root>

                        {/* RIGHT CARDS */}

                        <Grid
                            templateColumns={{
                                base: '1fr',
                                md: 'repeat(2, 1fr)',
                                xl: 'repeat(3, 1fr)',
                            }}
                            gap={5}
                        >
                            {transactionTypes.length >
                                0 ? (
                                transactionTypes.map(
                                    (item, index) => {
                                        const icons = [
                                            <ArrowDownLeft size={22} />,
                                            <ArrowUpRight size={22} />,
                                            <Repeat size={22} />,
                                        ]

                                        const bgColors = [
                                            'red.50',
                                            'green.50',
                                            'blue.50',
                                        ]

                                        const iconColors = [
                                            'red.500',
                                            'green.500',
                                            'blue.500',
                                        ]

                                        return (
                                            <Card.Root
                                                key={
                                                    item.id
                                                }
                                                bg='white'
                                                rounded='3xl'
                                                overflow='hidden'
                                                shadow='sm'
                                                border='1px solid'
                                                borderColor='gray.100'
                                                transition='0.25s'
                                                cursor='pointer'
                                                _hover={{
                                                    transform:
                                                        'translateY(-6px)',
                                                    shadow:
                                                        'xl',
                                                    borderColor:
                                                        'purple.200',
                                                }}
                                            >
                                                <Box
                                                    h='6px'
                                                    bg='purple.500'
                                                />

                                                <Card.Body p={6}>
                                                    <Flex
                                                        justify='space-between'
                                                        align='flex-start'
                                                    >
                                                        <VStack
                                                            align='start'
                                                            gap={3}
                                                        >
                                                            <Flex
                                                                w='56px'
                                                                h='56px'
                                                                rounded='2xl'
                                                                bg={
                                                                    bgColors[
                                                                    index %
                                                                    3
                                                                    ]
                                                                }
                                                                align='center'
                                                                justify='center'
                                                                color={
                                                                    iconColors[
                                                                    index %
                                                                    3
                                                                    ]
                                                                }
                                                            >
                                                                {
                                                                    icons[
                                                                    index %
                                                                    3
                                                                    ]
                                                                }
                                                            </Flex>

                                                            <Box>
                                                                <Heading
                                                                    size='md'
                                                                    color='gray.700'
                                                                >
                                                                    {
                                                                        item.name
                                                                    }
                                                                </Heading>

                                                                <Text
                                                                    mt={
                                                                        1
                                                                    }
                                                                    fontSize='sm'
                                                                    color='gray.500'
                                                                >
                                                                    Transaction
                                                                    Type
                                                                </Text>
                                                            </Box>
                                                        </VStack>

                                                        <Badge
                                                            colorPalette='purple'
                                                            rounded='full'
                                                            px={3}
                                                            py={1}
                                                        >
                                                            Active
                                                        </Badge>
                                                    </Flex>

                                                    <Flex
                                                        mt={6}
                                                        justify='space-between'
                                                        align='center'
                                                    >
                                                        <Text
                                                            fontSize='sm'
                                                            color='gray.400'
                                                        >
                                                            Finance
                                                            Management
                                                        </Text>

                                                        <Button
                                                            size='sm'
                                                            variant='ghost'
                                                            colorPalette='purple'
                                                            rounded='full'
                                                        >
                                                            View
                                                        </Button>
                                                    </Flex>
                                                </Card.Body>
                                            </Card.Root>
                                        )
                                    }
                                )
                            ) : (
                                <Card.Root
                                    rounded='3xl'
                                    bg='white'
                                    shadow='sm'
                                    p={10}
                                >
                                    <VStack gap={4}>
                                        <Box
                                            p={5}
                                            rounded='full'
                                            bg='purple.50'
                                            color='purple.600'
                                        >
                                            <Wallet size={32} />
                                        </Box>

                                        <Heading
                                            size='md'
                                            color='gray.700'
                                        >
                                            No Transaction Types
                                        </Heading>

                                        <Text
                                            textAlign='center'
                                            color='gray.500'
                                            fontSize='sm'
                                        >
                                            Create transaction
                                            types to organize
                                            your expense system
                                        </Text>
                                    </VStack>
                                </Card.Root>
                            )}
                        </Grid>
                    </Grid>
                </Tabs.Content>

                {/* ================================= */}
                {/* TAGS TAB */}
                {/* ================================= */}

                <Tabs.Content value='tags'>
                    <Grid templateColumns={{ base: '1fr', xl: '350px 1fr' }} gap={6}>
                        {/* FORM */}
                        <Card.Root bg='white' rounded='2xl' shadow='sm' p={6} alignSelf="start">
                            <Card.Header p={0} mb={6}>
                                <HStack>
                                    <Plus size={20} color="#6b46c1" />
                                    <Heading size='md' color='purple.700'>Create Tag</Heading>
                                </HStack>
                            </Card.Header>
                            <Card.Body p={0}>
                                <Stack gap={5}>
                                    <Field.Root>
                                        <Field.Label>Tag Name</Field.Label>
                                        <Input
                                            h='48px' bg='gray.50' placeholder='Enter tag name'
                                            value={tagForm.name}
                                            onChange={e => setTagForm({ ...tagForm, name: e.target.value })}
                                        />
                                    </Field.Root>
                                    <Button
                                        h='48px' rounded='lg' bg='purple.600' color='white'
                                        loading={btnLoading} _hover={{ bg: 'purple.700' }}
                                        onClick={handleCreateTag}
                                    >
                                        Create Tag
                                    </Button>
                                </Stack>
                            </Card.Body>
                        </Card.Root>

                        {/* TABLE */}
                        <Card.Root bg='white' rounded='2xl' shadow='sm' overflow='hidden' alignSelf="start">
                            <Card.Header p={6}>
                                <Heading size='md' color='purple.700'>Tags</Heading>
                            </Card.Header>
                            <Card.Body p={0}>
                                <Box overflowX='auto'>
                                    <Table.Root>
                                        <Table.Header bg='gray.50'>
                                            <Table.Row>
                                                <Table.ColumnHeader px={6}>Name</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign='center'>Action</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {tags.length > 0 ? tags.map(item => (
                                                <Table.Row key={item.id}>
                                                    <Table.Cell px={6}>
                                                        <Badge colorPalette='blue' p='3px 10px' rounded='full'>
                                                            #{item.name}
                                                        </Badge>
                                                    </Table.Cell>
                                                    <Table.Cell textAlign='center'>
                                                        <IconButton
                                                            size='sm' colorPalette='red' variant='subtle' rounded='lg' bg='none'
                                                            onClick={() => handleDeleteTag(item.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </IconButton>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )) : (
                                                <Table.Row>
                                                    <Table.Cell colSpan={2} textAlign='center' py={10}>
                                                        No Tags Found
                                                    </Table.Cell>
                                                </Table.Row>
                                            )}
                                        </Table.Body>
                                    </Table.Root>
                                </Box>
                            </Card.Body>
                        </Card.Root>
                    </Grid>
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    )
}

export default Master
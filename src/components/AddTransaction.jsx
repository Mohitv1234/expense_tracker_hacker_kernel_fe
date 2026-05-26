import React, { useState } from 'react'

import {
    Button,
    CloseButton,
    Dialog,
    Field,
    Flex,
    Grid,
    Input,
    Portal,
    Select,
    Textarea,
    createListCollection,
} from '@chakra-ui/react'

import { FiPlus } from 'react-icons/fi'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { createTransaction, updateTransaction } from '../service/transactionService'

import CustomToast from './CustomToast'

import { getAccounts, getCategories, getTransactionTypes } from '../service/masterService'

// =====================================
// VALIDATION
// =====================================

const TransactionSchema =
    Yup.object().shape({
        title: Yup.string().required(
            'Title is required'
        ),

        amount: Yup.number().required(
            'Amount is required'
        ),

        account_id:
            Yup.string().required(
                'Select account'
            ),

        category_id:
            Yup.string().required(
                'Select category'
            ),

        transaction_type_id:
            Yup.string().required(
                'Select transaction type'
            ),

        transaction_date:
            Yup.string().required(
                'Select date'
            ),
    })

function AddTransactionDialog({ onSuccess, initialData, triggerElement, title }) {
    const [open, setOpen] =
        useState(false)

    // =====================================
    // FETCH REAL DATA
    // =====================================
    const [accounts, setAccounts] = useState(createListCollection({ items: [] }))
    const [categories, setCategories] = useState(createListCollection({ items: [] }))
    const [transactionTypes, setTransactionTypes] = useState(createListCollection({ items: [] }))

    React.useEffect(() => {
        if (open) {
            fetchData()
        }
    }, [open])

    const fetchData = async () => {
        try {
            const [accRes, catRes, typeRes] = await Promise.all([
                getAccounts(),
                getCategories(),
                getTransactionTypes()
            ])

            const accData = accRes?.data?.data || accRes?.data || []
            const catData = catRes?.data?.data || catRes?.data || []
            const typeData = typeRes?.data?.data || typeRes?.data || []

            setAccounts(createListCollection({
                items: accData.map(item => ({ label: item.name, value: String(item.id) }))
            }))
            
            setCategories(createListCollection({
                items: catData.map(item => ({ label: item.name, value: String(item.id) }))
            }))

            setTransactionTypes(createListCollection({
                items: typeData.map(item => ({ label: item.name, value: String(item.id) }))
            }))
        } catch (error) {
            console.error('Error fetching select options', error)
        }
    }

    // =====================================
    // SUBMIT
    // =====================================

    const handleSubmit = async (
        values,
        setSubmitting,
        resetForm
    ) => {
        try {
            const payload = {
                ...values,

                amount: Number(
                    values.amount
                ),
            }

            let response;
            if (initialData?.id) {
                response = await updateTransaction(initialData.id, payload)
            } else {
                response = await createTransaction(payload)
            }

            if (response) {
                CustomToast({
                    title: 'Success',
                    description:
                        response?.message || `Transaction ${initialData?.id ? 'updated' : 'created'} successfully`,
                    type: 'success',
                })

                resetForm()
                setOpen(false)
                
                if (onSuccess) {
                    onSuccess()
                }
            }
        } catch (error) {
            console.log(error)

            CustomToast({
                title: 'Error',
                description:
                    error?.response?.data
                        ?.message ||
                    'Something went wrong',
                type: 'error',
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog.Root
            open={open}
            onOpenChange={e =>
                setOpen(e.open)
            }
            size='cover'
            placement='center'
        >
            {/* BUTTON */}

            <Dialog.Trigger asChild>
                {triggerElement || (
                    <Button
                        bg={'#8b5cf6'}
                        color={'white'}
                        rounded={'xl'}
                        px={5}
                        h={'48px'}
                        fontWeight={'600'}
                        _hover={{
                            bg: '#7c3aed',
                        }}
                    >
                        <FiPlus />
                        {title || 'Add Transaction'}
                    </Button>
                )}
            </Dialog.Trigger>

            <Portal>
                {/* BACKDROP */}

                <Dialog.Backdrop
                    bg={'blackAlpha.600'}
                    backdropFilter={
                        'blur(6px)'
                    }
                />

                <Dialog.Positioner p={4}>
                    <Dialog.Content
                        maxW={'900px'}
                        width={'100%'}
                        maxH={'90vh'}
                        overflow={'hidden'}
                        rounded={'3xl'}
                        bg={'white'}
                        border={
                            '1px solid #ede9fe'
                        }
                        boxShadow={
                            '0 25px 50px rgba(0,0,0,0.15)'
                        }
                    >
                        {/* HEADER */}

                        <Dialog.Header
                            px={8}
                            py={6}
                            borderBottom={
                                '1px solid #f3f4f6'
                            }
                        >
                            <Flex
                                direction={'column'}
                                gap={1}
                            >
                                <Dialog.Title
                                    fontSize={'2xl'}
                                    fontWeight={'700'}
                                    color={'#5b21b6'}
                                >
                                    {title || 'Add Transaction'}
                                </Dialog.Title>

                                <Dialog.Description
                                    color={'gray.500'}
                                    fontSize={'sm'}
                                >
                                    Manage your income and
                                    expenses
                                </Dialog.Description>
                            </Flex>
                        </Dialog.Header>

                        {/* BODY */}

                        <Dialog.Body
                            px={8}
                            py={6}
                            overflowY={'auto'}
                        >
                            <Formik
                                initialValues={{
                                    title: initialData?.title || '',
                                    amount: initialData?.amount || '',
                                    description: initialData?.description || '',
                                    account_id: initialData?.account_id ? String(initialData.account_id) : '',
                                    category_id: initialData?.category_id ? String(initialData.category_id) : '',
                                    transaction_type_id: initialData?.transaction_type_id ? String(initialData.transaction_type_id) : '',
                                    transaction_date: initialData?.transaction_date || '',
                                }}
                                validationSchema={
                                    TransactionSchema
                                }
                                onSubmit={(
                                    values,
                                    {
                                        setSubmitting,
                                        resetForm,
                                    }
                                ) =>
                                    handleSubmit(
                                        values,
                                        setSubmitting,
                                        resetForm
                                    )
                                }
                            >
                                {({
                                    values,
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    isSubmitting,
                                }) => (
                                    <Form>
                                        <Flex
                                            direction={'column'}
                                            gap={6}
                                        >
                                            {/* GRID */}

                                            <Grid
                                                templateColumns={{
                                                    base: '1fr',
                                                    md: '1fr 1fr',
                                                }}
                                                gap={5}
                                            >
                                                {/* TITLE */}

                                                <Field.Root
                                                    invalid={
                                                        errors.title &&
                                                        touched.title
                                                    }
                                                >
                                                    <Field.Label
                                                        mb={2}
                                                        fontWeight={
                                                            '600'
                                                        }
                                                        color={
                                                            'gray.700'
                                                        }
                                                    >
                                                        Title
                                                    </Field.Label>

                                                    <Input
                                                        name='title'
                                                        placeholder='Enter title'
                                                        bg={'gray.50'}
                                                        border={
                                                            '1px solid #e5e7eb'
                                                        }
                                                        rounded={'xl'}
                                                        h={'52px'}
                                                        px={4}
                                                        value={
                                                            values.title
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        onBlur={
                                                            handleBlur
                                                        }
                                                        _focus={{
                                                            borderColor:
                                                                '#8b5cf6',
                                                            boxShadow:
                                                                '0 0 0 1px #8b5cf6',
                                                        }}
                                                    />

                                                    <Field.ErrorText>
                                                        {errors.title}
                                                    </Field.ErrorText>
                                                </Field.Root>

                                                {/* AMOUNT */}

                                                <Field.Root
                                                    invalid={
                                                        errors.amount &&
                                                        touched.amount
                                                    }
                                                >
                                                    <Field.Label
                                                        mb={2}
                                                        fontWeight={
                                                            '600'
                                                        }
                                                        color={
                                                            'gray.700'
                                                        }
                                                    >
                                                        Amount
                                                    </Field.Label>

                                                    <Input
                                                        type='number'
                                                        name='amount'
                                                        placeholder='Enter amount'
                                                        bg={'gray.50'}
                                                        border={
                                                            '1px solid #e5e7eb'
                                                        }
                                                        rounded={'xl'}
                                                        h={'52px'}
                                                        px={4}
                                                        value={
                                                            values.amount
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        onBlur={
                                                            handleBlur
                                                        }
                                                        _focus={{
                                                            borderColor:
                                                                '#8b5cf6',
                                                            boxShadow:
                                                                '0 0 0 1px #8b5cf6',
                                                        }}
                                                    />

                                                    <Field.ErrorText>
                                                        {errors.amount}
                                                    </Field.ErrorText>
                                                </Field.Root>

                                                {/* ACCOUNT */}

                                                <Field.Root>
                                                    <Field.Label
                                                        mb={2}
                                                        fontWeight={
                                                            '600'
                                                        }
                                                        color={
                                                            'gray.700'
                                                        }
                                                    >
                                                        Account
                                                    </Field.Label>

                                                    <Select.Root
                                                        collection={
                                                            accounts
                                                        }
                                                        value={[
                                                            values.account_id,
                                                        ]}
                                                        onValueChange={e =>
                                                            handleChange({
                                                                target: {
                                                                    name: 'account_id',
                                                                    value:
                                                                        e.value[0],
                                                                },
                                                            })
                                                        }
                                                    >
                                                        <Select.HiddenSelect />

                                                        <Select.Control>
                                                            <Select.Trigger
                                                                bg={
                                                                    'gray.50'
                                                                }
                                                                border={
                                                                    '1px solid #e5e7eb'
                                                                }
                                                                rounded={
                                                                    'xl'
                                                                }
                                                                h={'52px'}
                                                                px={4}
                                                            >
                                                                <Select.ValueText placeholder='Select Account' />
                                                            </Select.Trigger>
                                                        </Select.Control>

                                                        <Select.Positioner>
                                                            <Select.Content>
                                                                {accounts.items.map(
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

                                                {/* CATEGORY */}

                                                <Field.Root>
                                                    <Field.Label
                                                        mb={2}
                                                        fontWeight={
                                                            '600'
                                                        }
                                                        color={
                                                            'gray.700'
                                                        }
                                                    >
                                                        Category
                                                    </Field.Label>

                                                    <Select.Root
                                                        collection={
                                                            categories
                                                        }
                                                        value={[
                                                            values.category_id,
                                                        ]}
                                                        onValueChange={e =>
                                                            handleChange({
                                                                target: {
                                                                    name: 'category_id',
                                                                    value:
                                                                        e.value[0],
                                                                },
                                                            })
                                                        }
                                                    >
                                                        <Select.HiddenSelect />

                                                        <Select.Control>
                                                            <Select.Trigger
                                                                bg={
                                                                    'gray.50'
                                                                }
                                                                border={
                                                                    '1px solid #e5e7eb'
                                                                }
                                                                rounded={
                                                                    'xl'
                                                                }
                                                                h={'52px'}
                                                                px={4}
                                                            >
                                                                <Select.ValueText placeholder='Select Category' />
                                                            </Select.Trigger>
                                                        </Select.Control>

                                                        <Select.Positioner>
                                                            <Select.Content>
                                                                {categories.items.map(
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

                                                {/* TYPE */}

                                                <Field.Root>
                                                    <Field.Label
                                                        mb={2}
                                                        fontWeight={
                                                            '600'
                                                        }
                                                        color={
                                                            'gray.700'
                                                        }
                                                    >
                                                        Transaction Type
                                                    </Field.Label>

                                                    <Select.Root
                                                        collection={
                                                            transactionTypes
                                                        }
                                                        value={[
                                                            values.transaction_type_id,
                                                        ]}
                                                        onValueChange={e =>
                                                            handleChange({
                                                                target: {
                                                                    name: 'transaction_type_id',
                                                                    value:
                                                                        e.value[0],
                                                                },
                                                            })
                                                        }
                                                    >
                                                        <Select.HiddenSelect />

                                                        <Select.Control>
                                                            <Select.Trigger
                                                                bg={
                                                                    'gray.50'
                                                                }
                                                                border={
                                                                    '1px solid #e5e7eb'
                                                                }
                                                                rounded={
                                                                    'xl'
                                                                }
                                                                h={'52px'}
                                                                px={4}
                                                            >
                                                                <Select.ValueText placeholder='Select Type' />
                                                            </Select.Trigger>
                                                        </Select.Control>

                                                        <Select.Positioner>
                                                            <Select.Content>
                                                                {transactionTypes.items.map(
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


                                                {/* DATE */}

                                                <Field.Root
                                                    invalid={
                                                        errors.transaction_date &&
                                                        touched.transaction_date
                                                    }
                                                >
                                                    <Field.Label
                                                        mb={2}
                                                        fontWeight={
                                                            '600'
                                                        }
                                                        color={
                                                            'gray.700'
                                                        }
                                                    >
                                                        Transaction Date
                                                    </Field.Label>

                                                    <Input
                                                        type='date'
                                                        name='transaction_date'
                                                        bg={'gray.50'}
                                                        border={
                                                            '1px solid #e5e7eb'
                                                        }
                                                        rounded={'xl'}
                                                        h={'52px'}
                                                        px={4}
                                                        value={
                                                            values.transaction_date
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        _focus={{
                                                            borderColor:
                                                                '#8b5cf6',
                                                            boxShadow:
                                                                '0 0 0 1px #8b5cf6',
                                                        }}
                                                    />

                                                    <Field.ErrorText>
                                                        {
                                                            errors.transaction_date
                                                        }
                                                    </Field.ErrorText>
                                                </Field.Root>
                                            </Grid>

                                            {/* DESCRIPTION */}

                                            <Field.Root>
                                                <Field.Label
                                                    mb={2}
                                                    fontWeight={'600'}
                                                    color={'gray.700'}
                                                >
                                                    Description
                                                </Field.Label>

                                                <Textarea
                                                    name='description'
                                                    placeholder='Enter description'
                                                    bg={'gray.50'}
                                                    border={
                                                        '1px solid #e5e7eb'
                                                    }
                                                    rounded={'xl'}
                                                    minH={'120px'}
                                                    value={
                                                        values.description
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    _focus={{
                                                        borderColor:
                                                            '#8b5cf6',
                                                        boxShadow:
                                                            '0 0 0 1px #8b5cf6',
                                                    }}
                                                />
                                            </Field.Root>

                                            {/* FOOTER */}

                                            <Flex
                                                justifyContent={
                                                    'flex-end'
                                                }
                                                gap={4}
                                                mt={4}
                                                pt={6}
                                                borderTop={
                                                    '1px solid #f3f4f6'
                                                }
                                            >
                                                <Dialog.ActionTrigger
                                                    asChild
                                                >
                                                    <Button
                                                        variant='outline'
                                                        rounded={'xl'}
                                                        px={6}
                                                        h={'48px'}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Dialog.ActionTrigger>

                                                <Button
                                                    type='submit'
                                                    loading={
                                                        isSubmitting
                                                    }
                                                    bg={'#8b5cf6'}
                                                    color={'white'}
                                                    rounded={'xl'}
                                                    px={8}
                                                    h={'48px'}
                                                    _hover={{
                                                        bg: '#7c3aed',
                                                    }}
                                                >
                                                    Save Transaction
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    </Form>
                                )}
                            </Formik>
                        </Dialog.Body>

                        {/* CLOSE */}

                        <Dialog.CloseTrigger
                            asChild
                        >
                            <CloseButton
                                size='sm'
                                top={4}
                                right={4}
                            />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default AddTransactionDialog
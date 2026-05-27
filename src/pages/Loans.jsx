import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    Field,
    Flex,
    Grid,
    Heading,
    HStack,
    Input,
    Select,
    Spinner,
    Stack,
    Text,
    createListCollection,
    Table,
    IconButton,
    Dialog,
    Badge,
    Portal,
    CloseButton,
    Tabs,
    Textarea
} from '@chakra-ui/react';
import { Landmark, Trash2, CreditCard, LucideUser, LucideFolder, LucideSquareCheck } from 'lucide-react';

import { createLoan, getLoans, deleteLoan, payLoanInstallment, sendReminder } from '../service/loanService';
import { getAccounts } from '../service/masterService';
import { MdNotificationAdd } from 'react-icons/md';
import { getAllUsers } from '../service/userService';

const loanTypes = createListCollection({
    items: [
        { label: 'Given (Lent)', value: 'given' },
        { label: 'Taken (Borrowed)', value: 'borrowed' }
    ]
});

function Loans() {
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [loans, setLoans] = useState([]);
    
    // Create Loan Form
    const [form, setForm] = useState({
        person_name: '',
        loan_type: [],
        total_amount: '',
        interest_rate: '',
        start_date: '',
        due_date: '',
        notes: ''
    });

    const [isPayOpen, setIsPayOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const loanRes = await getLoans();
            setLoans(loanRes?.data || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateLoan = async () => {
        if (!form.person_name || !form.loan_type.length || !form.total_amount || !form.start_date) {
            alert('Please fill required fields (Name, Type, Amount, Start Date)');
            return;
        }

        try {
            setBtnLoading(true);
            await createLoan({
                person_name: form.person_name,
                loan_type: form.loan_type[0],
                total_amount: Number(form.total_amount),
                interest_rate: Number(form.interest_rate || 0),
                start_date: form.start_date,
                due_date: form.due_date || null,
                notes: form.notes
            });
            setForm({
                person_name: '',
                loan_type: [],
                total_amount: '',
                interest_rate: '',
                start_date: '',
                due_date: '',
                notes: ''
            });
            fetchData();
        } catch (error) {
            console.log(error);
            alert(error.message || 'Error creating loan');
        } finally {
            setBtnLoading(false);
        }
    };

    const handleDeleteLoan = async (id) => {
        if (!window.confirm('Delete this loan?')) return;
        try {
            await deleteLoan(id);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    const openPayModal = (loan) => {
        setSelectedLoan(loan);
        setPayForm({
            loan_id: loan.id,
            account_id: [],
            amount: '',
            payment_date: new Date().toISOString().split('T')[0],
            notes: ''
        });
        setIsPayOpen(true);
    };



    if (loading) {
        return (
            <Flex h='80vh' justify='center' align='center'>
                <Spinner size='xl' color='purple.500' />
            </Flex>
        );
    }

    return (
        <Box p={{ base: 4, md: 6, lg: 8 }} bg='gray.50' minH='100vh'>
            <Flex justify='space-between' align='center' mb={6} flexWrap='wrap' gap={4}>
                <Box>
                    <Heading size='xl' color='purple.700'>Loan Management</Heading>
                    <Text mt={1} color='gray.500'>Track money you owe or are owed</Text>
                </Box>
            </Flex>

            <Grid templateColumns={{ base: '1fr', xl: '350px 1fr' }} gap={6}>
                {/* CREATE FORM */}
                <Card.Root bg='white' rounded='2xl' shadow='sm' p={6} alignSelf="start">
                    <Card.Header p={0} mb={6}>
                        <HStack>
                            <Landmark size={20} color="#6b46c1" />
                            <Heading size='md' color='purple.700'>Add Record</Heading>
                        </HStack>
                    </Card.Header>
                    <Card.Body p={0}>
                        <Stack gap={5}>
                            <Field.Root>
                                <Field.Label>Person Name</Field.Label>
                                <Input
                                    h='48px' bg='gray.50' placeholder='e.g., John Doe'
                                    value={form.person_name}
                                    onChange={e => setForm({ ...form, person_name: e.target.value })}
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Type</Field.Label>
                                <Select.Root
                                    collection={loanTypes}
                                    value={form.loan_type}
                                    onValueChange={e => setForm({ ...form, loan_type: e.value })}
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control>
                                        <Select.Trigger h='48px' bg='gray.50' rounded='lg'>
                                            <Select.ValueText placeholder='Select Type' />
                                        </Select.Trigger>
                                    </Select.Control>
                                    <Select.Positioner>
                                        <Select.Content rounded='lg'>
                                            {loanTypes.items.map(item => (
                                                <Select.Item item={item} key={item.value}>{item.label}</Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Select.Root>
                            </Field.Root>

                            <Grid templateColumns="1fr 1fr" gap={4}>
                                <Field.Root>
                                    <Field.Label>Amount</Field.Label>
                                    <Input
                                        h='48px' bg='gray.50' type='number' placeholder='0'
                                        value={form.total_amount}
                                        onChange={e => setForm({ ...form, total_amount: e.target.value })}
                                    />
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>Interest %</Field.Label>
                                    <Input
                                        h='48px' bg='gray.50' type='number' placeholder='0'
                                        value={form.interest_rate}
                                        onChange={e => setForm({ ...form, interest_rate: e.target.value })}
                                    />
                                </Field.Root>
                            </Grid>

                            <Grid templateColumns="1fr 1fr" gap={4}>
                                <Field.Root>
                                    <Field.Label>Start Date</Field.Label>
                                    <Input
                                        h='48px' bg='gray.50' type='date'
                                        value={form.start_date}
                                        onChange={e => setForm({ ...form, start_date: e.target.value })}
                                    />
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>Due Date</Field.Label>
                                    <Input
                                        h='48px' bg='gray.50' type='date'
                                        value={form.due_date}
                                        onChange={e => setForm({ ...form, due_date: e.target.value })}
                                    />
                                </Field.Root>
                            </Grid>

                            <Field.Root>
                                <Field.Label>Notes</Field.Label>
                                <Input
                                    h='48px' bg='gray.50' placeholder='Optional notes'
                                    value={form.notes}
                                    onChange={e => setForm({ ...form, notes: e.target.value })}
                                />
                            </Field.Root>

                            <Button
                                h='48px' rounded='lg' bg='purple.600' color='white'
                                loading={btnLoading} _hover={{ bg: 'purple.700' }}
                                onClick={handleCreateLoan}
                            >
                                Save Record
                            </Button>
                        </Stack>
                    </Card.Body>
                </Card.Root>

                {/* LOAN LIST */}
                <Card.Root bg='white' rounded='2xl' shadow='sm' overflow='hidden' alignSelf="start">
                    <Card.Header p={6}>
                        <Heading size='md' color='purple.700'>Active Loans & Debts</Heading>
                    </Card.Header>
                    <Card.Body p={0}>
                        <Box overflowX='auto'>
                            <Table.Root>
                                <Table.Header bg='gray.50'>
                                    <Table.Row>
                                        <Table.ColumnHeader px={6}>Person</Table.ColumnHeader>
                                        <Table.ColumnHeader>Type</Table.ColumnHeader>
                                        <Table.ColumnHeader>Amount</Table.ColumnHeader>
                                        <Table.ColumnHeader>Dates</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign='center'>Actions</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {loans.length > 0 ? loans.map(loan => (
                                        <Table.Row key={loan.id}>
                                            <Table.Cell px={6}>
                                                <Text fontWeight="medium">{loan.person_name}</Text>
                                                <Text fontSize="xs" color="gray.500">{loan.notes}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge colorPalette={loan.loan_type === 'given' ? 'green' : 'red'}>
                                                    {loan.loan_type.toUpperCase()}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text fontWeight="bold">₹{loan.total_amount}</Text>
                                                {loan.interest_rate > 0 && <Text fontSize="xs">+{loan.interest_rate}% int</Text>}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text fontSize="sm">{new Date(loan.start_date).toLocaleDateString()}</Text>
                                                {loan.due_date && <Text fontSize="xs" color="gray.500">Due: {new Date(loan.due_date).toLocaleDateString()}</Text>}
                                            </Table.Cell>
                                            <Table.Cell textAlign='center'>
                                                <HStack justify="center">
                                                    {loan.loan_type === 'given' ?
                                                    <PaymentReminderDailog selectedLoan={loan} />
                                                    :
                                                    <PaymentDailog selectedLoan={loan} />
                                                    }
                                                    <IconButton size='sm' colorPalette='red' variant='subtle' bg='none' onClick={() => handleDeleteLoan(loan.id)}>
                                                        <Trash2 size={16} />
                                                    </IconButton>
                                                </HStack>
                                            </Table.Cell>
                                        </Table.Row>
                                    )) : (
                                        <Table.Row>
                                            <Table.Cell colSpan={5} textAlign='center' py={10}>No loan records found</Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    </Card.Body>
                </Card.Root>
            </Grid>
        </Box>
    );
}

export default Loans;




const PaymentDailog = ({selectedLoan })=>{
    const [accounts, setAccounts] = useState(createListCollection({ items: [] }));
    const [payBtnLoading, setPayBtnLoading] = useState(false);
    const [payForm, setPayForm] = useState({
        loan_id: '',
        account_id: [],
        amount: '',
        payment_date: '',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const clearPaymentFormData = ()=>{
        setPayForm({
            loan_id: '',
            account_id: [],
            amount: '',
            payment_date: '',
            notes: ''
        })
    }
    const fetchData = async () => {
        try {
            const accRes = await getAccounts();
            const accData = accRes?.data?.data || accRes?.data || [];
            setAccounts(
                createListCollection({
                    items: accData.map(a => ({ label: `${a.name} (₹${a.balance})`, value: String(a.id) }))
                })
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handlePayInstallment = async () => {
        if (!payForm.account_id.length || !payForm.amount || !payForm.payment_date) {
            alert('Please fill all payment details');
            return;
        }

        try {
            setPayBtnLoading(true);
            await payLoanInstallment({
                loan_id: payForm.loan_id,
                account_id: payForm.account_id[0],
                amount: Number(payForm.amount),
                payment_date: payForm.payment_date,
                notes: payForm.notes
            });
            setIsPayOpen(false);
            fetchData();
        } catch (error) {
            console.log(error);
            alert(error.message || 'Error making payment');
        } finally {
            setPayBtnLoading(false);
        }
    };

    return (
        <Dialog.Root>
        <Dialog.Trigger asChild>
            <Button variant="outline" size="sm" onClick={clearPaymentFormData}>
                <CreditCard />
            </Button>
        </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
           <Dialog.Content rounded="2xl" p={6}>
                    <Dialog.Header mb={4}>
                        <Dialog.Title color="purple.700">Make Payment - {selectedLoan?.person_name}</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Stack gap={4}>
                            <Field.Root>
                                <Field.Label>From Account</Field.Label>
                                <Select.Root
                                    collection={accounts}
                                    value={payForm.account_id}
                                    onValueChange={e => setPayForm({ ...payForm, account_id: e.value })}
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control>
                                        <Select.Trigger h='48px' bg='gray.50' rounded='lg'>
                                            <Select.ValueText placeholder='Select Account' />
                                        </Select.Trigger>
                                    </Select.Control>
                                    <Select.Positioner>
                                        <Select.Content rounded='lg' zIndex={1400}>
                                            {accounts.items.map(item => (
                                                <Select.Item item={item} key={item.value}>{item.label}</Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Select.Root>
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Amount</Field.Label>
                                <Input
                                    h='48px' bg='gray.50' type='number' placeholder='0'
                                    value={payForm.amount}
                                    onChange={e => setPayForm({ ...payForm, amount: e.target.value })}
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Date</Field.Label>
                                <Input
                                    h='48px' bg='gray.50' type='date'
                                    value={payForm.payment_date}
                                    onChange={e => setPayForm({ ...payForm, payment_date: e.target.value })}
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Notes</Field.Label>
                                <Input
                                    h='48px' bg='gray.50' placeholder='Optional notes'
                                    value={payForm.notes}
                                    onChange={e => setPayForm({ ...payForm, notes: e.target.value })}
                                />
                            </Field.Root>
                        </Stack>
                    </Dialog.Body>
                    <Dialog.Footer mt={6}>
                        <Dialog.ActionTrigger asChild>
                            <Button variant="outline" rounded="lg">Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Button 
                            bg="purple.600" color="white" rounded="lg" _hover={{bg: 'purple.700'}}
                            loading={payBtnLoading} onClick={handlePayInstallment}
                        >
                            Confirm Payment
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
        </Dialog.Root>
  )
}

const PaymentReminderDailog = ({selectedLoan })=>{
    const [accounts, setAccounts] = useState(createListCollection({ items: [] }));
    const [payBtnLoading, setPayBtnLoading] = useState(false);
    const [reminderForm, setReminderForm] = useState({
        userId: '',
        notificationMode: '',
        mobileNumber: '',
        email: '',
        title: '',
        content: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const clearPaymentFormData = ()=>{
         setReminderForm({
            userId: '',
            notificationMode: '',
            mobileNumber: '',
            email: '',
            title: '',
            content: '',
        })
    }
    const fetchData = async () => {
        try {
            const accRes = await getAllUsers();
            const accData = accRes?.data?.data || accRes?.data || [];
            setAccounts(
                createListCollection({
                    items: accData.map(a => ({ label: `${a.name}`, value: String(a.id) }))
                })
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleSendReminder = async () => {
        try {
            await sendReminder(null);
        } catch (error) {
            console.log(error);
            alert(error.message || 'Error making payment');
        } finally {
        }
    };

    return (
        <Dialog.Root size={'lg'}>
        <Dialog.Trigger asChild>
            <Button variant="outline" size="sm" onClick={clearPaymentFormData}>
                <MdNotificationAdd />
            </Button>
        </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
           <Dialog.Content rounded="2xl" p={6}>
                    <Dialog.Header mb={4}>
                        <Dialog.Title color="purple.700">Send Reminder for Payment - {selectedLoan?.person_name}</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Stack gap={0}>
                             <Tabs.Root defaultValue="application" variant={'line'}>
                                <Tabs.List gap={3}>
                                <Tabs.Trigger value="application">
                                    <LucideUser />
                                    Application Notification
                                </Tabs.Trigger>
                                <Tabs.Trigger value="email">
                                    <LucideFolder />
                                    Email Notification
                                </Tabs.Trigger>
                                <Tabs.Trigger value="phone">
                                    <LucideSquareCheck />
                                    Phone Notification
                                </Tabs.Trigger>
                                </Tabs.List>
                                <Tabs.Content value="application" padding={'10px 10px 0px 10px'}>
                                    <Field.Root>
                                        <Field.Label>User</Field.Label>
                                        <Select.Root
                                            collection={accounts}
                                            value={reminderForm.userId}
                                            onValueChange={e => setReminderForm({ ...reminderForm, userId: e.value })}
                                        >
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger h='48px' bg='gray.50' rounded='lg'>
                                                <Select.ValueText placeholder='Select Account' />
                                            </Select.Trigger>
                                        </Select.Control>
                                        <Select.Positioner>
                                            <Select.Content rounded='lg' zIndex={1400}>
                                                {accounts.items.map(item => (
                                                    <Select.Item item={item} key={item.value}>{item.label}</Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Select.Root>
                                    </Field.Root>
                                </Tabs.Content>
                                
                                <Tabs.Content value="email" padding={'10px 10px 0px 10px'}>
                                    <Field.Root>
                                        <Field.Label>Email</Field.Label>
                                        <Input
                                            h='48px' bg='gray.50' type='number' placeholder='Email'
                                            value={reminderForm.email}
                                            onChange={e => setPayForm({ ...reminderForm, email: e.target.value })}
                                        />
                                    </Field.Root>
                                </Tabs.Content>
                                
                                <Tabs.Content value="phone" padding={'10px 10px 0px 10px'}>
                                    <Field.Root>
                                        <Field.Label>Contact Number</Field.Label>
                                        <Input
                                            h='48px' bg='gray.50' type='number' placeholder='Contact Number'
                                            value={reminderForm.mobileNumber}
                                            onChange={e => setPayForm({ ...reminderForm, mobileNumber: e.target.value })}
                                        />
                                    </Field.Root>
                                </Tabs.Content>
                            </Tabs.Root>

                            <Box padding={'10px 10px 0px 10px'}>
                                <Field.Root>
                                    <Field.Label>Title</Field.Label>
                                    <Input
                                        h='48px' bg='gray.50' type='number' placeholder='Reminder Title'
                                        value={reminderForm.title}
                                        onChange={e => setPayForm({ ...reminderForm, title: e.target.value })}
                                    />
                                </Field.Root>
                                <Field.Root mt={2}>
                                    <Field.Label>Content</Field.Label>
                                    <Textarea
                                        h='48px' bg='gray.50' type='number' placeholder='write your message here'
                                        value={reminderForm.content}
                                        onChange={e => setPayForm({ ...reminderForm, content: e.target.value })}
                                    />
                                </Field.Root>
                            </Box>
                           
                        </Stack>
                    </Dialog.Body>
                    <Dialog.Footer mt={6}>
                        <Dialog.ActionTrigger asChild>
                            <Button variant="outline" rounded="lg" padding={'10px 20px'}>Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Button 
                            bg="purple.600" color="white" rounded="lg" _hover={{bg: 'purple.700'}}
                            loading={payBtnLoading} onClick={handleSendReminder}
                            padding={'10px 20px'}
                        >
                            Send Reminder
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
        </Dialog.Root>
  )
}
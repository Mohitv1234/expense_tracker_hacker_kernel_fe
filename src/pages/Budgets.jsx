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
    Progress
} from '@chakra-ui/react';
import { Wallet, Target } from 'lucide-react';

import { createBudget, getBudgets, getBudgetUsage } from '../service/budgetService';
import { getCategories } from '../service/masterService';

function Budgets() {
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [budgets, setBudgets] = useState([]);
    const [budgetUsages, setBudgetUsages] = useState({});
    
    const [categories, setCategories] = useState(createListCollection({ items: [] }));
    
    const [form, setForm] = useState({
        category_id: [],
        amount: '',
        start_date: '',
        end_date: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const catRes = await getCategories();
            const catData = catRes?.data?.data || catRes?.data || [];
            setCategories(
                createListCollection({
                    items: catData.map(c => ({ label: c.name, value: String(c.id) }))
                })
            );

            const budRes = await getBudgets();
            const budData = budRes?.data || [];
            setBudgets(budData);

            // Fetch usage for each budget
            const usages = {};
            for (const b of budData) {
                try {
                    const usageRes = await getBudgetUsage(b.id);
                    usages[b.id] = usageRes.data;
                } catch (e) {
                    console.log('Error fetching usage for budget', b.id);
                }
            }
            setBudgetUsages(usages);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateBudget = async () => {
        if (!form.category_id.length || !form.amount || !form.start_date || !form.end_date) {
            alert('Please fill all fields');
            return;
        }

        try {
            setBtnLoading(true);
            await createBudget({
                category_id: form.category_id[0],
                amount: Number(form.amount),
                start_date: form.start_date,
                end_date: form.end_date
            });
            setForm({
                category_id: [],
                amount: '',
                start_date: '',
                end_date: ''
            });
            fetchData();
        } catch (error) {
            console.log(error);
        } finally {
            setBtnLoading(false);
        }
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
                    <Heading size='xl' color='purple.700'>Budget Management</Heading>
                    <Text mt={1} color='gray.500'>Plan and track your spending limits</Text>
                </Box>
            </Flex>

            <Grid templateColumns={{ base: '1fr', xl: '350px 1fr' }} gap={6}>
                {/* CREATE FORM */}
                <Card.Root bg='white' rounded='2xl' shadow='sm' p={6} alignSelf="start">
                    <Card.Header p={0} mb={6}>
                        <HStack>
                            <Target size={20} color="#6b46c1" />
                            <Heading size='md' color='purple.700'>Create Budget</Heading>
                        </HStack>
                    </Card.Header>
                    <Card.Body p={0}>
                        <Stack gap={5}>
                            <Field.Root>
                                <Field.Label>Category</Field.Label>
                                <Select.Root
                                    collection={categories}
                                    value={form.category_id}
                                    onValueChange={e => setForm({ ...form, category_id: e.value })}
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control>
                                        <Select.Trigger h='48px' bg='gray.50' rounded='lg'>
                                            <Select.ValueText placeholder='Select Category' />
                                        </Select.Trigger>
                                    </Select.Control>
                                    <Select.Positioner>
                                        <Select.Content rounded='lg'>
                                            {categories.items.map(item => (
                                                <Select.Item item={item} key={item.value}>{item.label}</Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Select.Root>
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Amount</Field.Label>
                                <Input
                                    h='48px' bg='gray.50' type='number' placeholder='0.00'
                                    value={form.amount}
                                    onChange={e => setForm({ ...form, amount: e.target.value })}
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Start Date</Field.Label>
                                <Input
                                    h='48px' bg='gray.50' type='date'
                                    value={form.start_date}
                                    onChange={e => setForm({ ...form, start_date: e.target.value })}
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>End Date</Field.Label>
                                <Input
                                    h='48px' bg='gray.50' type='date'
                                    value={form.end_date}
                                    onChange={e => setForm({ ...form, end_date: e.target.value })}
                                />
                            </Field.Root>

                            <Button
                                h='48px' rounded='lg' bg='purple.600' color='white'
                                loading={btnLoading} _hover={{ bg: 'purple.700' }}
                                onClick={handleCreateBudget}
                            >
                                Set Budget
                            </Button>
                        </Stack>
                    </Card.Body>
                </Card.Root>

                {/* BUDGET LIST */}
                <Box>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                        {budgets.length > 0 ? (
                            budgets.map(budget => {
                                const usage = budgetUsages[budget.id] || { used: 0, remaining: Number(budget.amount), percentage: 0 };
                                const isOver = usage.percentage >= 100;
                                const isWarning = usage.percentage >= 80 && !isOver;
                                
                                return (
                                    <Card.Root key={budget.id} bg='white' rounded='2xl' shadow='sm' p={6}>
                                        <Flex justify="space-between" align="center" mb={4}>
                                            <Heading size="md" color="purple.700">{budget.Category?.name || 'Unknown'}</Heading>
                                            <Text fontSize="sm" color="gray.500">{new Date(budget.start_date).toLocaleDateString()} - {new Date(budget.end_date).toLocaleDateString()}</Text>
                                        </Flex>
                                        
                                        <Progress.Root max={Number(budget.amount)} value={usage.used} mb={4} colorPalette={isOver ? 'red' : isWarning ? 'orange' : 'purple'}>
                                            <HStack justify="space-between" mb={2}>
                                                <Progress.Label>₹{Number(usage.used).toFixed(2)} spent</Progress.Label>
                                                <Progress.ValueText>₹{budget.amount} limit</Progress.ValueText>
                                            </HStack>
                                            <Progress.Track bg="gray.100">
                                                <Progress.Range rounded="full" />
                                            </Progress.Track>
                                        </Progress.Root>
                                        
                                        <HStack justify="space-between" mt={4} pt={4} borderTop="1px solid" borderColor="gray.100">
                                            <Box>
                                                <Text fontSize="sm" color="gray.500">Remaining</Text>
                                                <Text fontWeight="bold" color={isOver ? 'red.500' : 'green.500'}>
                                                    ₹{Number(usage.remaining).toFixed(2)}
                                                </Text>
                                            </Box>
                                            <Box textAlign="right">
                                                <Text fontSize="sm" color="gray.500">Usage</Text>
                                                <Text fontWeight="bold" color={isOver ? 'red.500' : 'purple.700'}>
                                                    {usage.percentage}%
                                                </Text>
                                            </Box>
                                        </HStack>
                                    </Card.Root>
                                );
                            })
                        ) : (
                            <Box colSpan={2} textAlign="center" py={10} color="gray.500" bg="white" rounded="2xl" shadow="sm">
                                No budgets found. Create one to get started.
                            </Box>
                        )}
                    </Grid>
                </Box>
            </Grid>
        </Box>
    );
}

export default Budgets;

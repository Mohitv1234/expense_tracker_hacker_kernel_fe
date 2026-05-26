import React, { useEffect, useState } from 'react'

import {
    Badge,
    Box,
    Button,
    Card,
    Flex,
    Heading,
    HStack,
    Spinner,
    Stack,
    Text,
} from '@chakra-ui/react'

function Profile() {
    const [loading, setLoading] =
        useState(false)

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
                        Profile
                    </Heading>

                    <Text
                        mt={1}
                        color='gray.500'
                    >
                        Manage Your Personal Details
                        and Configurations 
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
                                Balance
                            </Text>

                            <Badge colorPalette='purple'>
                                {
                                    accounts.length
                                }
                            </Badge>
                        </HStack>
                    </Card.Root>
                </HStack>
            </Flex>


        </Box>
    )
}

export default Profile
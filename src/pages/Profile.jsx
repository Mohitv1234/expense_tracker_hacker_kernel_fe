import React, { useEffect, useState } from "react";
import {
    Avatar,
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
  VStack,
} from "@chakra-ui/react";
import { getProfile } from "../service/userService";

function Profile() {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(()=>{
    fetchProfile();
  },[])

const fetchProfile = async () => {
    try {
        setLoading(true)
        const res = await getProfile()
        setProfileData(res?.data?.data || res?.data || [])
    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false)
    }
}

  if (loading) {
    return (
      <Flex h="80vh" justify="center" align="center">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  return (
    <Box
      p={{
        base: 4,
        md: 6,
        lg: 8,
      }}
      bg="gray.50"
      minH="100vh"
    >
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        flexWrap="wrap"
        gap={4}
      >
        <Box>
          <Heading size="xl" color="purple.700">
            Profile
          </Heading>

          <Text mt={1} color="gray.500">
            Manage Your Personal Details and Configurations
          </Text>
        </Box>

        <HStack gap={3}>
          <Card.Root p={3} rounded="xl" bg="white" shadow="sm">
            <HStack>
              <Text color="gray.500">Balance</Text>
            </HStack>
          </Card.Root>
        </HStack>
      </Flex>

    <Card.Root width="320px" padding={'10px'} marginTop={'40px'}>
      <Card.Body>
        <Avatar.Root size="2xl" margin={'-50px auto 0px auto'} width={'100px'} height={'100px'}>
          <Avatar.Fallback name={profileData?.name} />
        </Avatar.Root>
        <Card.Title mt="2">Name</Card.Title>
        <Card.Description>
          {profileData?.name}
        </Card.Description>
         <Card.Title mt="2">Email</Card.Title>
        <Card.Description>
          {profileData?.email}
        </Card.Description>
        <Card.Title mt="2">Phone</Card.Title>
        <Card.Description>
          {profileData?.phone}
        </Card.Description>
      </Card.Body>
    </Card.Root>
    </Box>
  );
}

export default Profile;

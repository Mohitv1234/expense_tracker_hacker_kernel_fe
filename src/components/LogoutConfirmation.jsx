import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Text,
  Flex,
  Box,
  Heading,
} from "@chakra-ui/react";

import { FiLogOut } from "react-icons/fi";
import { MdWarningAmber } from "react-icons/md";
import { useNavigate } from "react-router";

const LogoutConfirmation = () => {
  const handleLogout = () => {
    localStorage.removeItem("authentication-token");

    window.location.replace('/login');
  };

  return (
    <Dialog.Root placement={"center"}>
      {/* Trigger Button */}
      <Dialog.Trigger asChild>
        <Button
          w={"100%"}
          bg={"#8b5cf6"}
          color={"white"}
          rounded={"xl"}
          _hover={{
            bg: "#7c3aed",
          }}
          display={"flex"}
          alignItems={"center"}
          gap={2}
        >
          <FiLogOut />

          <Text display={{ base: "none", md: "block" }}>
            Logout
          </Text>
        </Button>
      </Dialog.Trigger>

      {/* Modal */}
      <Portal>
        <Dialog.Backdrop
          bg={"blackAlpha.600"}
          backdropFilter={"blur(4px)"}
        />

        <Dialog.Positioner>
          <Dialog.Content
            rounded={"3xl"}
            bg={"white"}
            border={"1px solid #ede9fe"}
            boxShadow={"2xl"}
            p={2}
          >
            {/* Close Button */}
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size={"sm"}
                position={"absolute"}
                top={4}
                right={4}
              />
            </Dialog.CloseTrigger>

            {/* Header */}
            <Dialog.Header>
              <Flex
                direction={"column"}
                alignItems={"center"}
                textAlign={"center"}
                w={"100%"}
                mt={4}
              >
                <Box
                  bg={"red.100"}
                  color={"red.500"}
                  p={4}
                  rounded={"full"}
                  mb={4}
                >
                  <MdWarningAmber size={32} />
                </Box>

                <Heading
                  size={"lg"}
                  color={"#5b21b6"}
                >
                  Logout Confirmation
                </Heading>
              </Flex>
            </Dialog.Header>

            {/* Body */}
            <Dialog.Body pb={6}>
              <Text
                textAlign={"center"}
                color={"gray.600"}
                fontSize={"md"}
                lineHeight={"tall"}
              >
                Are you sure you want to logout from your
                account?
              </Text>
            </Dialog.Body>

            {/* Footer */}
            <Dialog.Footer>
              <Flex gap={3} w={"100%"}>
                <Dialog.ActionTrigger asChild>
                  <Button
                    flex={1}
                    variant={"outline"}
                    rounded={"xl"}
                  >
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>

                <Button
                  flex={1}
                  bg={"red.500"}
                  color={"white"}
                  rounded={"xl"}
                  _hover={{
                    bg: "red.600",
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Flex>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default LogoutConfirmation;
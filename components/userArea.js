import { Avatar } from "@chakra-ui/avatar";
import { Center, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/layout";

export default function UserArea({ userData }) {
  const { name, image } = userData

  return (
    <Flex>
      <HStack>
        <Avatar size="sm" src={ image } />
        <Center>
          <VStack
            mt="1"
            spacing={-0.5}
            align="start"
          >
            <Heading size="xs" as="h6">{ name.substr(0, name.length - 5) }</Heading>
            <Text fontSize="xs">{ name.substr(-5) }</Text>
          </VStack>
        </Center>
      </HStack>
    </Flex>
  )
}
import { signIn, signOut, useSession } from 'next-auth/client'
import { Avatar, Box, Button, Center, Flex, Heading, HStack, Menu, MenuButton, MenuItem, MenuList, Spacer, Text } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'

export default function Header() {
  const [ session, loading ] = useSession()

  return (
    <Box p="6">
    <Flex>
      <Center>
        <Box>
          <Heading size="lg" as="h1">Discordスケジュール</Heading>
        </Box>
      </Center>
      <Spacer />
      <Box>
        {!session && <>
          <Button onClick={() => signIn()}>サインイン</Button>
        </>}
        {session && <>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Flex>
                <HStack>
                  <Avatar size="sm" src={session.user.image} />
                  <Center display={{base: "none", sm:"inline"}}>
                    <Heading size="sm" as="h6">{session.user.name}</Heading>
                  </Center>
                </HStack>
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => signOut()}>サインアウト</MenuItem>
            </MenuList>
          </Menu>
        </>}
      </Box>
    </Flex>
    </Box>
  )
}
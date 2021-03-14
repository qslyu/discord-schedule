import { signIn, signOut, useSession } from 'next-auth/client'
import { Avatar, Box, Button, Center, Flex, Heading, HStack, Image, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, Text } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { FaDiscord } from 'react-icons/fa'
import useLocale from '../hooks/useLocale'

import { useRouter } from 'next/router'

export default function Header() {
  const [ session, loading ] = useSession()
  const { _, t } = useLocale()

  const router = useRouter()


  return (
    <Center>
      <Box p="6" width={{base: "100%", md: "60%"}}>
        <Flex>
          <Center>
            <Heading size="md" as="h1">Discord Schedule</Heading>
          </Center>
          <Spacer />

          <Box>
            {!session && <>
              <Button onClick={() => signIn()}><Icon mr="3" as={FaDiscord} /> {t.SIGN_IN}</Button>
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
                  <MenuItem onClick={() => signOut()}>{t.SIGN_OUT}</MenuItem>
                </MenuList>
              </Menu>
            </>}
          </Box>
        </Flex>
      </Box>
    </Center>
  )
}
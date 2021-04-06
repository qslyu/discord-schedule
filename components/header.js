import { signIn, signOut, useSession } from 'next-auth/client'
import { Avatar, Box, Button, Center, Flex, Heading, HStack, Image, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, Text, SkeletonCircle, Skeleton } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { FaDiscord } from 'react-icons/fa'
import useLocale from '../hooks/useLocale'

import { useRouter } from 'next/router'
import UserArea from './userArea'

export default function Header() {
  const [ session, loading ] = useSession()
  const { locale, t } = useLocale()

  const router = useRouter()

  return (
    <Center>
      <Box p="6" width={{base: "100%", md: "60%"}}>
        <Flex>
          <Center onClick={() => {router.push('/', '/', {locale: locale})}}>
            <Image mr="3" boxSize="80px" src="/logo.svg" />
          </Center>

          <Spacer />

          <Center>
            {!session && <>
              <Button onClick={() => signIn('discord')}>
                <Skeleton isLoaded={!loading}>
                  <Icon mr="3" as={FaDiscord} /> {t.SIGN_IN}
                </Skeleton>
              </Button>
            </>}
            {session && <>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  <UserArea userData={session.user} />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => signOut()}>{t.SIGN_OUT}</MenuItem>
                </MenuList>
              </Menu>
            </>}
          </Center>
        </Flex>
      </Box>
    </Center>
  )
}
import { useRouter } from 'next/router'
import Header from '../../components/header'
import useSWR from 'swr'
import { fetcher } from '../../util/fetcher'
import { Box, Center, Heading, Stack, Text } from '@chakra-ui/layout'
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import DateTimeFormat from '../../util/dateTimeFormat'
import { BsFillCircleFill, BsFillExclamationCircleFill, BsFillDashCircleFill } from 'react-icons/bs'
import Icon from '@chakra-ui/icon'
import Head from 'next/head'
import { Skeleton } from '@chakra-ui/skeleton'
import useLocale from '../../hooks/useLocale'

export default function Event() {
  const router = useRouter()
  const { id } = router.query
  const { locale, t } = useLocale()

  if(!id) {
    return null
  }

  const { data, error } = useSWR(`/api/event/${id}`, fetcher)
  
  return (
    <>
      <Head>
        <title>{data ? data.name : 'loading'} - Discord Schedule</title>
      </Head>
      <Header />
      <Center>
        <Box p="10" w={{base: "100%", md: "60%"}}>
          <Heading size="xl" as="h2" mb= "6">{data ? data.name: (<Skeleton >dammy</Skeleton>)}</Heading>
          <Text mb="6">{data ? "製作者: " + data.contributor: (<Skeleton w="10px" />)}</Text>
          <Text mb="6">{data ? data.description: (<Skeleton>dammy</Skeleton>)}</Text>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th /><Th /><Th /><Th />
              </Tr>
            </Thead>
            <Tbody>
              {data ? data.schedule.map((d, i) => (
                <Tr key={i}>
                  <Td>{DateTimeFormat(d.date, locale)}〜</Td>
                  <Td><Icon as={BsFillCircleFill} color="green.400" /> {d.users.excellent.length}</Td>
                  <Td><Icon as={BsFillExclamationCircleFill} color="yellow.400" /> {d.users.excellent.length}</Td>
                  <Td><Icon as={BsFillDashCircleFill} color="red.400" /> {d.users.excellent.length}</Td>
                </Tr>
              )): (
                <>
                  <Tr>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                  </Tr>
                  <Tr>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                  </Tr>                  
                  <Tr>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                  </Tr>
                </>
              )}
            </Tbody>
          </Table>
        </Box>
      </Center>
    </>
  )
}
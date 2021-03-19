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
import isValidQuery from '../../util/isValidQuery'
import { Spinner } from '@chakra-ui/spinner'

export default function Event() {
  const router = useRouter()
  const { id } = router.query
  const { locale, t } = useLocale()

  const { data, error } = useSWR(isValidQuery(id)?`/api/event/${id}`:null, id?fetcher:null)

  if(data && data.error == 'not found') return (
    <>
      <Head>
        <title>{t.EVENT_NOT_FOUND} - Discord Schedule</title>
      </Head>
      <Header />
      <Center mt="10">
        <Heading size="xl" as="h2" mb= "6">{t.EVENT_NOT_FOUND}</Heading>
      </Center>
    </>
  )

  if(data && data.error) return (
    <>
      <Head>
        <title>{t.ERROR} - Discord Schedule</title>
      </Head>
      <Header />
      <Center mt="10">
        <Heading size="xl" as="h2" mb= "6">Error</Heading>
      </Center>
    </>
  )

  return (
    <>
      <Head>
        <title>{data ? data.name : 'loading'} - Discord Schedule</title>
      </Head>
      <Header />
      <Center>
        <Box p="10" w={{base: "100%", md: "60%"}}>
          {data ? <Heading size="xl" as="h2" mb= "6">{data.name}</Heading> : <Skeleton mb= "6"><Heading size="xl">loading</Heading></Skeleton>}
          {data ? <Text mb="6">{`${t.CONTRIBUTOR}: ${data.contributor}`}</Text> : <Skeleton mb= "6">loading</Skeleton>}
          {data ? <Text mb="6">{data.description}</Text> : <Skeleton mb= "6">loading</Skeleton>}

          {data ? (
            <Table variant="simple">
            <Thead>
              <Tr>
                <Th /><Th /><Th /><Th />
              </Tr>
            </Thead>
            <Tbody>
              {data.schedule.map((d, i) => (
                <Tr key={i}>
                  <Td>{DateTimeFormat(d.date, locale)}〜</Td>
                  <Td><Icon as={BsFillCircleFill} color="green.400" /> {d.users.excellent.length}</Td>
                  <Td><Icon as={BsFillExclamationCircleFill} color="yellow.400" /> {d.users.excellent.length}</Td>
                  <Td><Icon as={BsFillDashCircleFill} color="red.400" /> {d.users.excellent.length}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          ):(
            <Center mt="10">
              <Spinner />
            </Center>
          )}

        </Box>
      </Center>
    </>
  )
}
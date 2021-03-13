import { useRouter } from 'next/router'
import Header from '../../components/header'
import useSWR from 'swr'
import { fetcher } from '../../util/fetcher'
import { Box, Center, Heading, Text } from '@chakra-ui/layout'
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import DateTimeFormat from '../../util/dateTimeFormat'
import { BsFillCircleFill, BsFillExclamationCircleFill, BsFillDashCircleFill } from 'react-icons/bs'
import Icon from '@chakra-ui/icon'

export default function Event() {
  const router = useRouter()
  const { id } = router.query

  if(!id) {
    return null
  }

  const { data, error } = useSWR(`/api/event/${id}`, fetcher)

  return (
    <>
      <Header />
      {data ? (
        <Center>
          <Box p="10" w={{base: "100%", md: "60%"}}>
            <Heading size="xl" as="h2" mb= "6">{unescape(data.name)}</Heading>
            <Text mb="6">製作者: {data.contributor}</Text>
            <Text mb="6">{data.description}</Text>
  
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th /><Th /><Th /><Th />
                </Tr>
              </Thead>
              <Tbody>
                {data.schedule.map((d, i) => (
                  <Tr key={i}>
                    <Td>{DateTimeFormat(d.date)}〜</Td>
                    <Td><Icon as={BsFillCircleFill} color="green.400" /> {d.users.excellent.length}</Td>
                    <Td><Icon as={BsFillExclamationCircleFill} color="yellow.400" /> {d.users.excellent.length}</Td>
                    <Td><Icon as={BsFillDashCircleFill} color="red.400" /> {d.users.excellent.length}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          
          </Box>
        </Center>
      ):(
        <Text>loading</Text>
      )}

    </>
  )
}
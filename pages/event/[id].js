import { useRouter } from 'next/router'
import Header from '../../components/header'
import { Box, Center, Flex, Heading, Stack, Text, VStack } from '@chakra-ui/layout'
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import DateTimeFormat from '../../util/dateTimeFormat'
import { BsFillCircleFill, BsFillExclamationCircleFill, BsFillDashCircleFill, BsCircle, BsExclamationCircle, BsDashCircle } from 'react-icons/bs'
import Icon from '@chakra-ui/icon'
import Head from 'next/head'
import useLocale from '../../hooks/useLocale'
import { connectToDatabase } from '../../util/mongodb'
import { ObjectId } from 'bson'
import getUserData from '../../util/getUserData'
import { Input } from '@chakra-ui/input'
import { useEffect, useState } from 'react'
import { useClipboard } from '@chakra-ui/hooks'
import { Button } from '@chakra-ui/button'
import UserArea from '../../components/userArea'
import { useToast } from '@chakra-ui/toast'
import { Spinner } from '@chakra-ui/spinner'

function VoteButton({d, eventId, evaluation, icon, fillIcon, color}) {
  const router = useRouter()
  const toast = useToast()

  const [isSending, setIsSending] = useState(false)

  function vote(operation, datetime, evaluation) {
    const data = {
      "operation": operation,
      "id": eventId,
      "datetime": datetime,
      "evaluation": evaluation
    }

    if(!isSending) {
      setIsSending(true)

      fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(async data => {
        if(data.success) {
          await router.replace(router.asPath)
          setIsSending(false)
        }
      })
      .catch(err => {
        toast({
          title: "エラー",
          description: "送信に失敗しました",
          status: "error",
          duration: 9000,
          isClosable: true,
        })
      })
    }
  }

  return (
    <VStack
      onClick={() => vote(
        d.evaluation != evaluation ? 'add' : 'remove', 
        d.datetime, 
        evaluation
      )}
    >
      <Icon
        as={d.evaluation == evaluation ? fillIcon : icon}
        color={color}
      />
      {isSending ? <Spinner size="xs" /> : <Text>{d.evaluation_count[evaluation]}</Text>}
    </VStack>
  )
}

export default function Event({ data, notFound }) {
  const router = useRouter()

  const { id } = router.query

  const [value, setValue] = useState(`${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`)
  const { hasCopied, onCopy } = useClipboard(value)

  const { locale, t } = useLocale()



  if(notFound) return(
    <>
      <Head>
        <title>{t.EVENT_NOT_FOUND} - Discord Schedule</title>
      </Head>
      <Header />
      <Center>
        <Heading mt="20">{t.EVENT_NOT_FOUND}</Heading>
      </Center>
    </>
  )

  return (
    <>
      <Head>
        <title>{data.name} - Discord Schedule</title>
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`} />
        <meta property="og:title" content={data.name} />
        <meta property="og:description" content={data.description} />
        <meta property="og:image" key="ogImage" content={`${process.env.NEXT_PUBLIC_BASE_URL}/api/image/${router.query.id}`} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.name} />
        <meta name="twitter:description" content={data.description} />
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/api/image/${router.query.id}`} />
      </Head>
      <Header />
      <Center>
        <Box p="10" w={{base: "100%", md: "60%"}}>
          <Flex mb="10">
            <Input value={value} isReadOnly />
            <Button onClick={onCopy} ml="2">
              {hasCopied ? "Copied" : "Copy"}
            </Button>
          </Flex>

          <Heading size="xl" as="h2" mb="6">{data.name}</Heading> 

          <UserArea userData={data.contributor}/>

          <Text mt="6" mb="6">{data.description ? data.description : t.NO_DESCRIPTION}</Text>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th /><Th /><Th /><Th />
              </Tr>
            </Thead>
            <Tbody>
              {data.schedule.map((d, i) => (
                <Tr key={i}>
                  <Td>{DateTimeFormat(d.datetime, locale)}〜</Td>
                  <Td>
                    <VoteButton 
                      d={d} 
                      eventId={id} 
                      evaluation='excellent'
                      icon={BsCircle} 
                      fillIcon={BsFillCircleFill} 
                      color="green.400" 
                    />
                  </Td>
                  <Td>
                    <VoteButton 
                      d={d} 
                      eventId={id} 
                      evaluation='average'
                      icon={BsExclamationCircle} 
                      fillIcon={BsFillExclamationCircleFill} 
                      color="yellow.400"
                    />
                  </Td>
                  <Td>
                    <VoteButton 
                      d={d} 
                      eventId={id} 
                      evaluation='bad'
                      icon={BsDashCircle} 
                      fillIcon={BsFillDashCircleFill} 
                      color="red.400"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

        </Box>
      </Center>
    </>
  )
}

export async function getServerSideProps(context) {
  if(context.req.headers['accept-language']) {
    const acceptLanguage = context.req.headers['accept-language'].substr(0, 2)
    const { locale } = context

    if(locale != acceptLanguage) {
      context.res.writeHead(302, { Location: `/${acceptLanguage}${context.resolvedUrl}` })
      context.res.end()
    }
  }

  const { id } = context.query
  const { db } = await connectToDatabase()
  
  let ObjId

  try {
    ObjId = ObjectId(id)
  } catch {
    return {
      props: {
        notFound: true
      }
    }
  }

  const data = await db
    .collection('events')
    .findOne({
      _id: ObjId
    })

  if(data) {
    return {
      props: {
        data: JSON.parse(JSON.stringify({
          name:         unescape(data.name),
          description:  unescape(data.description),
          contributor:  await getUserData(data.contributor_id),
          schedule:     data.schedule
        }))
      }
    }
  } else {
    return {
      props: {
        notFound: true
      }
    }
  }
}
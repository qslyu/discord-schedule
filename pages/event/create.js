import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button, IconButton } from '@chakra-ui/button'
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { Input } from '@chakra-ui/input'
import { Box, Center, Flex, Heading } from '@chakra-ui/layout'
import { Textarea } from '@chakra-ui/textarea'
import Header from '../../components/header'
import { useToast } from '@chakra-ui/toast'
import { validateEventName, validateDescription, validateSchedule } from '../../util/validate'
import getTimeStamp from '../../util/getTimeStamp'

export default function Create() {
  const router = useRouter()
  const toast = useToast()

  const [showError, setShowError] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [datetime, setDatetime] = useState('')
  const [schedule, setSchedule] = useState([])
  const [isSending, setIsSending] = useState(false)

  const nowTimeStamp = getTimeStamp(new Date(Date.now()))

  function submit() {
    setShowError(true)
    setIsSending(true)

    if (
      validateEventName(name) ||
      validateDescription(description) ||
      (validateSchedule(schedule) && !datetime )
    ) {
      toast({
        title: "エラー",
        description: "入力に不備があります",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
      setIsSending(false)
      return
    }

    let scheduleDate = []
    if(!!datetime) scheduleDate.push(new Date(datetime))
    
    schedule.map(d => {
      scheduleDate.push(new Date(d))
    })

    const data = {
      "name": name,
      "description": description,
      "schedule": scheduleDate
    }

    fetch('/api/event/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      if(data.success) {
        setIsSending(false)
        router.push(data.url)
      }
    })
    .catch(err => {
      setIsSending(false)
      toast({
        title: "エラー",
        description: "送信に失敗しました",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    })
  }

  return (
    <>
      <Header />
      <Center>
        <Box p="10" width={{base: "100%", sm: "70%"}}>
          <Heading size="xl" as="h2">新規作成</Heading>
            
            <FormControl isInvalid={showError && validateEventName(name)} isRequired mt="12">
              <FormLabel>イベント名</FormLabel>
              <Input value={name} w={{base: "100%", md: 350}} onChange={(e) => setName(e.target.value)} />
              <FormErrorMessage>{validateEventName(name)}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={showError && validateDescription(description)} mt="6">
              <FormLabel>イベントの説明</FormLabel>
              <Textarea value={description} w={{base: "100%", md: 350}} onChange={(e) => setDescription(e.target.value)} />
              <FormErrorMessage>{validateDescription(description)}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={showError && !datetime && validateSchedule(schedule)} w={{base: "100%", md: 350}} mt="6">
              <FormLabel>日程</FormLabel>

              {schedule.map((d, index) => (
                <Flex key={index}>
                  <Input 
                    value={d}
                    onChange={(e) => {
                      setSchedule([...schedule.slice(0, index), e.target.value, ...schedule.slice(index + 1)])
                    }}
                    mr="1" 
                    mb="1" 
                    type="datetime-local"
                    min={nowTimeStamp}
                  />
                  <IconButton 
                    onClick={() => {
                      setSchedule(schedule.filter((a, i) => i != index))
                    }}
                    icon={<DeleteIcon />}
                  />
                </Flex>
              ))}
              
              <Flex>
                <Input value={datetime} onChange={(e) => {setDatetime(e.target.value)}} mr="1" type="datetime-local" min={nowTimeStamp} />
                <IconButton 
                  onClick={() => {
                    if(datetime) {
                      setSchedule([...schedule, datetime])
                      setDatetime('')
                    }
                  }}
                  icon={<AddIcon />}
                />
              </Flex>
              <FormErrorMessage>{validateSchedule(schedule)}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              isLoading={isSending}
              mt="12"
              onClick={submit}
            >
              作成
            </Button>
        </Box>
      </Center>
    </>
  )
}
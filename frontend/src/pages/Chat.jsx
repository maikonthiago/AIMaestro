import { useState, useEffect, useRef } from 'react'
import {
  Box, VStack, HStack, Input, Button, Text, Card, CardBody,
  Heading, Avatar, useToast
} from '@chakra-ui/react'
import { FiSend } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function Chat() {
  const { id } = useParams()
  const [agent, setAgent] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const toast = useToast()

  useEffect(() => {
    loadAgent()
  }, [id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadAgent = async () => {
    try {
      const response = await axios.get(`/api/agents/${id}`)
      setAgent(response.data)
    } catch (error) {
      toast({ title: 'Erro ao carregar agente', status: 'error' })
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post('/api/chat/', {
        agent_id: parseInt(id),
        message: input,
        session_id: sessionId
      })

      if (!sessionId) {
        setSessionId(response.data.session_id)
      }

      const assistantMessage = {
        role: 'assistant',
        content: response.data.message
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      toast({
        title: 'Erro ao enviar mensagem',
        description: error.response?.data?.detail || 'Erro desconhecido',
        status: 'error'
      })
    }

    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Box maxW="container.lg" mx="auto">
      <Heading mb={4}>Chat com {agent?.name || 'Agente'}</Heading>

      <Card h="calc(100vh - 250px)">
        <CardBody display="flex" flexDirection="column">
          {/* Messages */}
          <VStack
            flex="1"
            overflowY="auto"
            spacing={4}
            align="stretch"
            mb={4}
          >
            {messages.length === 0 ? (
              <Text color="gray.500" textAlign="center">
                Inicie uma conversa...
              </Text>
            ) : (
              messages.map((msg, idx) => (
                <MessageBubble key={idx} message={msg} />
              ))
            )}
            <div ref={messagesEndRef} />
          </VStack>

          {/* Input */}
          <HStack>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              disabled={loading}
            />
            <Button
              colorScheme="brand"
              onClick={sendMessage}
              isLoading={loading}
              leftIcon={<FiSend />}
            >
              Enviar
            </Button>
          </HStack>
        </CardBody>
      </Card>
    </Box>
  )
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <HStack
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      maxW="70%"
    >
      {!isUser && <Avatar size="sm" name="AI" />}
      <Box
        bg={isUser ? 'brand.500' : 'gray.100'}
        color={isUser ? 'white' : 'black'}
        px={4}
        py={2}
        borderRadius="lg"
      >
        <Text whiteSpace="pre-wrap">{message.content}</Text>
      </Box>
      {isUser && <Avatar size="sm" name="User" />}
    </HStack>
  )
}

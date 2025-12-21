import { useState, useEffect } from 'react'
import {
  Box, Button, Heading, SimpleGrid, Card, CardBody, Text,
  Badge, IconButton, useToast, HStack, VStack
} from '@chakra-ui/react'
import { FiPlus, FiEdit, FiTrash, FiMessageCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Agents() {
  const [agents, setAgents] = useState([])
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    try {
      const response = await axios.get('/api/agents/')
      setAgents(response.data)
    } catch (error) {
      toast({
        title: 'Erro ao carregar agentes',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const deleteAgent = async (id) => {
    if (!confirm('Deseja realmente deletar este agente?')) return

    try {
      await axios.delete(`/api/agents/${id}`)
      toast({
        title: 'Agente deletado com sucesso',
        status: 'success',
        duration: 3000,
      })
      loadAgents()
    } catch (error) {
      toast({
        title: 'Erro ao deletar agente',
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <Box>
      <HStack justifyContent="space-between" mb={6}>
        <Heading>Meus Agentes</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="brand"
          onClick={() => navigate('/agents/new')}
        >
          Criar Agente
        </Button>
      </HStack>

      {agents.length === 0 ? (
        <Card>
          <CardBody textAlign="center" py={10}>
            <Text>Nenhum agente criado ainda</Text>
            <Button mt={4} onClick={() => navigate('/agents/new')}>
              Criar seu primeiro agente
            </Button>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <HStack justifyContent="space-between">
                    <Heading size="md">{agent.name}</Heading>
                    <Badge colorScheme={agent.is_published ? 'green' : 'gray'}>
                      {agent.is_published ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </HStack>
                  
                  <Text color="gray.600" noOfLines={2}>
                    {agent.description || 'Sem descrição'}
                  </Text>

                  <Text fontSize="sm">
                    Modelo: <Badge>{agent.model}</Badge>
                  </Text>

                  <HStack>
                    <IconButton
                      icon={<FiMessageCircle />}
                      onClick={() => navigate(`/agents/${agent.id}/chat`)}
                      title="Testar"
                    />
                    <IconButton
                      icon={<FiEdit />}
                      onClick={() => navigate(`/agents/${agent.id}/edit`)}
                      title="Editar"
                    />
                    <IconButton
                      icon={<FiTrash />}
                      onClick={() => deleteAgent(agent.id)}
                      colorScheme="red"
                      title="Deletar"
                    />
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}

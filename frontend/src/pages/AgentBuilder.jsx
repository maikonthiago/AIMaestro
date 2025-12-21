import { useState, useEffect } from 'react'
import {
  Box, Button, FormControl, FormLabel, Input, Textarea,
  Select, Heading, Card, CardBody, VStack, useToast, NumberInput,
  NumberInputField, Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function AgentBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model: 'gpt-4',
    temperature: 0.7,
    max_tokens: 1000,
    system_prompt: '',
  })

  useEffect(() => {
    if (id) {
      loadAgent()
    }
  }, [id])

  const loadAgent = async () => {
    try {
      const response = await axios.get(`/api/agents/${id}`)
      setFormData(response.data)
    } catch (error) {
      toast({ title: 'Erro ao carregar agente', status: 'error' })
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (id) {
        await axios.put(`/api/agents/${id}`, formData)
        toast({ title: 'Agente atualizado com sucesso', status: 'success' })
      } else {
        await axios.post('/api/agents/', formData)
        toast({ title: 'Agente criado com sucesso', status: 'success' })
      }
      navigate('/agents')
    } catch (error) {
      toast({ title: 'Erro ao salvar agente', status: 'error' })
    }

    setLoading(false)
  }

  return (
    <Box maxW="container.md" mx="auto">
      <Heading mb={6}>{id ? 'Editar' : 'Criar'} Agente</Heading>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Tabs>
              <TabList>
                <Tab>Informações Básicas</Tab>
                <Tab>Configurações</Tab>
                <Tab>Personalidade</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Nome do Agente</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Assistente de Vendas"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Descrição</FormLabel>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Agente especializado em..."
                      />
                    </FormControl>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel>Modelo</FormLabel>
                      <Select
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                      >
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="claude-3-opus">Claude 3 Opus</option>
                        <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Temperature (0-2)</FormLabel>
                      <NumberInput
                        value={formData.temperature}
                        min={0}
                        max={2}
                        step={0.1}
                        onChange={(val) => setFormData({ ...formData, temperature: parseFloat(val) })}
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Max Tokens</FormLabel>
                      <NumberInput
                        value={formData.max_tokens}
                        min={1}
                        max={4000}
                        onChange={(val) => setFormData({ ...formData, max_tokens: parseInt(val) })}
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel>System Prompt</FormLabel>
                      <Textarea
                        name="system_prompt"
                        value={formData.system_prompt}
                        onChange={handleChange}
                        placeholder="Você é um assistente prestativo..."
                        rows={10}
                      />
                    </FormControl>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              width="full"
              mt={6}
              isLoading={loading}
            >
              {id ? 'Atualizar' : 'Criar'} Agente
            </Button>
          </form>
        </CardBody>
      </Card>
    </Box>
  )
}

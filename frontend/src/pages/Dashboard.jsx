import { useState, useEffect } from 'react'
import {
  Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
  Heading, Card, CardBody, Button, useToast
} from '@chakra-ui/react'
import { FiUsers, FiMessageCircle, FiActivity, FiTrendingUp } from 'react-icons/fi'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await axios.get('/api/analytics/dashboard')
      setStats(response.data)
    } catch (error) {
      toast({
        title: 'Erro ao carregar estatísticas',
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <Box>
      <Heading mb={6}>Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard
          icon={FiUsers}
          label="Total de Agentes"
          value={stats?.total_agents || 0}
          color="blue"
        />
        <StatCard
          icon={FiMessageCircle}
          label="Total de Conversas"
          value={stats?.total_conversations || 0}
          color="green"
        />
        <StatCard
          icon={FiActivity}
          label="Conversas Ativas"
          value={stats?.active_conversations || 0}
          color="purple"
        />
        <StatCard
          icon={FiTrendingUp}
          label="Total de Mensagens"
          value={stats?.total_messages || 0}
          color="orange"
        />
      </SimpleGrid>

      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Começar</Heading>
          <Button colorScheme="brand" onClick={() => navigate('/agents/new')}>
            Criar Novo Agente
          </Button>
        </CardBody>
      </Card>
    </Box>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card>
      <CardBody>
        <Stat>
          <StatLabel>{label}</StatLabel>
          <StatNumber>{value}</StatNumber>
          <Box as={Icon} color={`${color}.500`} size="24px" mt={2} />
        </Stat>
      </CardBody>
    </Card>
  )
}

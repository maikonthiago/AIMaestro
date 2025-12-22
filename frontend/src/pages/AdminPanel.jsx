import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { FiMoreVertical, FiUsers, FiCpu, FiMessageSquare, FiTrendingUp } from 'react-icons/fi'
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'

export default function AdminPanel() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [agents, setAgents] = useState([])
  const [tenants, setTenants] = useState([])
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar se é super admin
    if (!user?.is_superadmin) {
      toast({
        title: 'Acesso negado',
        description: 'Você não tem permissão para acessar esta página',
        status: 'error',
        duration: 3000,
      })
      navigate('/app')
      return
    }

    loadData()
  }, [user, navigate, toast])

  const loadData = async () => {
    try {
      setLoading(true)
      const [statsRes, usersRes, agentsRes, tenantsRes, activityRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users?limit=50'),
        axios.get('/api/admin/agents?limit=50'),
        axios.get('/api/admin/tenants?limit=50'),
        axios.get('/api/admin/recent-activity?limit=20'),
      ])
      
      setStats(statsRes.data)
      setUsers(usersRes.data)
      setAgents(agentsRes.data)
      setTenants(tenantsRes.data)
      setActivity(activityRes.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast({
        title: 'Erro ao carregar dados',
        description: error.response?.data?.detail || 'Tente novamente',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId, action) => {
    try {
      let endpoint = ''
      let message = ''
      
      switch (action) {
        case 'activate':
          endpoint = `/api/admin/users/${userId}/activate`
          message = 'Usuário ativado com sucesso'
          break
        case 'deactivate':
          endpoint = `/api/admin/users/${userId}/deactivate`
          message = 'Usuário desativado com sucesso'
          break
        case 'delete':
          if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return
          endpoint = `/api/admin/users/${userId}`
          message = 'Usuário deletado com sucesso'
          break
        case 'upgrade-pro':
          endpoint = `/api/admin/users/${userId}/plan?plan=pro`
          message = 'Plano alterado para Pro'
          break
        case 'upgrade-business':
          endpoint = `/api/admin/users/${userId}/plan?plan=business`
          message = 'Plano alterado para Business'
          break
      }

      if (action === 'delete') {
        await axios.delete(endpoint)
      } else {
        await axios.patch(endpoint)
      }

      toast({
        title: 'Sucesso',
        description: message,
        status: 'success',
        duration: 3000,
      })

      loadData()
    } catch (error) {
      console.error('Erro na ação:', error)
      toast({
        title: 'Erro',
        description: error.response?.data?.detail || 'Tente novamente',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const getPlanBadgeColor = (plan) => {
    const colors = {
      starter: 'gray',
      pro: 'purple',
      business: 'blue',
      enterprise: 'green'
    }
    return colors[plan] || 'gray'
  }

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Heading>Carregando...</Heading>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Alert status="info" mb={6}>
        <AlertIcon />
        Painel de Administração do Sistema - Acesso Super Admin
      </Alert>

      <Heading mb={6}>Painel de Administração</Heading>

      {/* Estatísticas */}
      {stats && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Stat
            px={4}
            py={5}
            bg="white"
            shadow="md"
            rounded="lg"
            border="1px"
            borderColor="gray.200"
          >
            <StatLabel display="flex" alignItems="center" gap={2}>
              <FiUsers /> Usuários
            </StatLabel>
            <StatNumber>{stats.users.total}</StatNumber>
            <StatHelpText>
              {stats.users.active} ativos • {stats.users.new_30d} novos (30d)
            </StatHelpText>
          </Stat>

          <Stat
            px={4}
            py={5}
            bg="white"
            shadow="md"
            rounded="lg"
            border="1px"
            borderColor="gray.200"
          >
            <StatLabel display="flex" alignItems="center" gap={2}>
              <FiCpu /> Agentes
            </StatLabel>
            <StatNumber>{stats.agents.total}</StatNumber>
            <StatHelpText>Total de agentes criados</StatHelpText>
          </Stat>

          <Stat
            px={4}
            py={5}
            bg="white"
            shadow="md"
            rounded="lg"
            border="1px"
            borderColor="gray.200"
          >
            <StatLabel display="flex" alignItems="center" gap={2}>
              <FiMessageSquare /> Mensagens
            </StatLabel>
            <StatNumber>{stats.messages.total}</StatNumber>
            <StatHelpText>{stats.conversations.total} conversas</StatHelpText>
          </Stat>

          <Stat
            px={4}
            py={5}
            bg="white"
            shadow="md"
            rounded="lg"
            border="1px"
            borderColor="gray.200"
          >
            <StatLabel display="flex" alignItems="center" gap={2}>
              <FiTrendingUp /> Tenants
            </StatLabel>
            <StatNumber>{stats.tenants.total}</StatNumber>
            <StatHelpText>Organizações ativas</StatHelpText>
          </Stat>
        </SimpleGrid>
      )}

      {/* Tabs */}
      <Tabs>
        <TabList>
          <Tab>Usuários ({users.length})</Tab>
          <Tab>Agentes ({agents.length})</Tab>
          <Tab>Tenants ({tenants.length})</Tab>
          <Tab>Atividade Recente</Tab>
        </TabList>

        <TabPanels>
          {/* Tab Usuários */}
          <TabPanel>
            <Box bg="white" shadow="md" rounded="lg" overflow="hidden">
              <Table>
                <Thead bg="gray.50">
                  <Tr>
                    <Th>ID</Th>
                    <Th>Nome de Usuário</Th>
                    <Th>Email</Th>
                    <Th>Plano</Th>
                    <Th>Status</Th>
                    <Th>Criado em</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.id}</Td>
                      <Td>
                        {user.username}
                        {user.is_superadmin && (
                          <Badge ml={2} colorScheme="red">SUPER ADMIN</Badge>
                        )}
                      </Td>
                      <Td>{user.email}</Td>
                      <Td>
                        <Badge colorScheme={getPlanBadgeColor(user.plan)}>
                          {user.plan}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme={user.is_active ? 'green' : 'red'}>
                          {user.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </Td>
                      <Td>{new Date(user.created_at).toLocaleDateString('pt-BR')}</Td>
                      <Td>
                        {!user.is_superadmin && (
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<FiMoreVertical />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              {user.is_active ? (
                                <MenuItem onClick={() => handleUserAction(user.id, 'deactivate')}>
                                  Desativar
                                </MenuItem>
                              ) : (
                                <MenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                                  Ativar
                                </MenuItem>
                              )}
                              <MenuItem onClick={() => handleUserAction(user.id, 'upgrade-pro')}>
                                Mudar para Pro
                              </MenuItem>
                              <MenuItem onClick={() => handleUserAction(user.id, 'upgrade-business')}>
                                Mudar para Business
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleUserAction(user.id, 'delete')}
                                color="red.500"
                              >
                                Deletar
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          {/* Tab Agentes */}
          <TabPanel>
            <Box bg="white" shadow="md" rounded="lg" overflow="hidden">
              <Table>
                <Thead bg="gray.50">
                  <Tr>
                    <Th>ID</Th>
                    <Th>Nome</Th>
                    <Th>Modelo</Th>
                    <Th>Versão</Th>
                    <Th>Público</Th>
                    <Th>Criado em</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {agents.map((agent) => (
                    <Tr key={agent.id}>
                      <Td>{agent.id}</Td>
                      <Td>{agent.name}</Td>
                      <Td>
                        <Badge colorScheme="purple">{agent.model}</Badge>
                      </Td>
                      <Td>v{agent.version}</Td>
                      <Td>
                        <Badge colorScheme={agent.is_public ? 'green' : 'gray'}>
                          {agent.is_public ? 'Sim' : 'Não'}
                        </Badge>
                      </Td>
                      <Td>{new Date(agent.created_at).toLocaleDateString('pt-BR')}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          {/* Tab Tenants */}
          <TabPanel>
            <Box bg="white" shadow="md" rounded="lg" overflow="hidden">
              <Table>
                <Thead bg="gray.50">
                  <Tr>
                    <Th>ID</Th>
                    <Th>Nome</Th>
                    <Th>Slug</Th>
                    <Th>Plano</Th>
                    <Th>Status</Th>
                    <Th>Criado em</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tenants.map((tenant) => (
                    <Tr key={tenant.id}>
                      <Td>{tenant.id}</Td>
                      <Td>{tenant.name}</Td>
                      <Td>{tenant.slug}</Td>
                      <Td>
                        <Badge colorScheme={getPlanBadgeColor(tenant.plan)}>
                          {tenant.plan}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme={tenant.is_active ? 'green' : 'red'}>
                          {tenant.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </Td>
                      <Td>{new Date(tenant.created_at).toLocaleDateString('pt-BR')}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          {/* Tab Atividade */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {/* Usuários Recentes */}
              {activity?.recent_users && (
                <Box bg="white" shadow="md" rounded="lg" p={6}>
                  <Heading size="md" mb={4}>Usuários Recentes</Heading>
                  {activity.recent_users.slice(0, 5).map((u) => (
                    <Box key={u.id} py={2} borderBottom="1px" borderColor="gray.100">
                      <Text fontWeight="bold">{u.username}</Text>
                      <Text fontSize="sm" color="gray.500">{u.email}</Text>
                      <Text fontSize="xs" color="gray.400">
                        {new Date(u.created_at).toLocaleString('pt-BR')}
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Agentes Recentes */}
              {activity?.recent_agents && (
                <Box bg="white" shadow="md" rounded="lg" p={6}>
                  <Heading size="md" mb={4}>Agentes Recentes</Heading>
                  {activity.recent_agents.slice(0, 5).map((a) => (
                    <Box key={a.id} py={2} borderBottom="1px" borderColor="gray.100">
                      <Text fontWeight="bold">{a.name}</Text>
                      <HStack spacing={2}>
                        <Badge size="sm" colorScheme="purple">{a.model}</Badge>
                      </HStack>
                      <Text fontSize="xs" color="gray.400">
                        {new Date(a.created_at).toLocaleString('pt-BR')}
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Conversas Recentes */}
              {activity?.recent_conversations && (
                <Box bg="white" shadow="md" rounded="lg" p={6}>
                  <Heading size="md" mb={4}>Conversas Recentes</Heading>
                  {activity.recent_conversations.slice(0, 5).map((c) => (
                    <Box key={c.id} py={2} borderBottom="1px" borderColor="gray.100">
                      <Text fontWeight="bold">Sessão: {c.session_id.slice(0, 8)}...</Text>
                      <Text fontSize="xs" color="gray.400">
                        {new Date(c.created_at).toLocaleString('pt-BR')}
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  )
}

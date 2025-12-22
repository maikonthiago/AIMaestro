import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  Flex,
  Icon,
  useColorModeValue,
  SimpleGrid,
  HStack,
  VStack,
  Avatar,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FiCpu, FiZap, FiShield, FiTrendingUp, FiUsers, FiMessageSquare } from 'react-icons/fi'

const Feature = ({ title, text, icon }) => {
  return (
    <Stack align='center'>
      <Flex
        w={16}
        h={16}
        align='center'
        justify='center'
        color='white'
        rounded='full'
        bg={useColorModeValue('purple.500', 'purple.600')}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600} fontSize='lg'>{title}</Text>
      <Text color='gray.600' align='center'>{text}</Text>
    </Stack>
  )
}

const Testimonial = ({ name, role, content }) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      p={8}
      rounded='xl'
      shadow='md'
    >
      <VStack spacing={4} align='start'>
        <HStack>
          <Avatar size='md' />
          <Box>
            <Text fontWeight='bold'>{name}</Text>
            <Text fontSize='sm' color='gray.500'>{role}</Text>
          </Box>
        </HStack>
        <Text color='gray.600'>"{content}"</Text>
      </VStack>
    </Box>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <Box>
      {/* Header */}
      <Box
        as='nav'
        bg={useColorModeValue('white', 'gray.800')}
        borderBottom='1px'
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        py={4}
      >
        <Container maxW='container.xl'>
          <Flex justify='space-between' align='center'>
            <Heading size='lg' bgGradient='linear(to-r, purple.400, pink.400)' bgClip='text'>
              AI Maestro
            </Heading>
            <HStack spacing={4}>
              <Button variant='ghost' onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button colorScheme='purple' onClick={() => navigate('/register')}>
                Começar Grátis
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        bgGradient='linear(to-br, purple.50, pink.50)'
        py={20}
      >
        <Container maxW='container.xl'>
          <Stack spacing={8} align='center' textAlign='center'>
            <Heading
              fontSize={{ base: '4xl', md: '6xl' }}
              bgGradient='linear(to-r, purple.600, pink.600)'
              bgClip='text'
            >
              Orquestre o Futuro da IA
            </Heading>
            <Text fontSize={{ base: 'xl', md: '2xl' }} color='gray.600' maxW='3xl'>
              Crie, gerencie e implante agentes de IA inteligentes com uma plataforma poderosa 
              e intuitiva. Transforme sua visão em realidade com o AI Maestro.
            </Text>
            <HStack spacing={4}>
              <Button
                size='lg'
                colorScheme='purple'
                onClick={() => navigate('/register')}
                leftIcon={<FiZap />}
              >
                Começar Gratuitamente
              </Button>
              <Button
                size='lg'
                variant='outline'
                onClick={() => navigate('/login')}
              >
                Ver Demo
              </Button>
            </HStack>
            <Text fontSize='sm' color='gray.500'>
              Sem cartão de crédito • Setup em 2 minutos • Cancele quando quiser
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW='container.xl'>
          <Stack spacing={12}>
            <Stack spacing={4} align='center' textAlign='center'>
              <Heading>Recursos Poderosos</Heading>
              <Text fontSize='lg' color='gray.600' maxW='2xl'>
                Tudo que você precisa para criar agentes de IA inteligentes e escaláveis
              </Text>
            </Stack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
              <Feature
                icon={<Icon as={FiCpu} w={8} h={8} />}
                title='Multi-LLM'
                text='Integração com GPT-4, Claude-3, Gemini e mais. Escolha o melhor modelo para cada tarefa.'
              />
              <Feature
                icon={<Icon as={FiMessageSquare} w={8} h={8} />}
                title='RAG Engine'
                text='Upload de documentos e busca inteligente. Seus agentes sempre com o contexto certo.'
              />
              <Feature
                icon={<Icon as={FiZap} w={8} h={8} />}
                title='Workflows'
                text='Automatize processos complexos com workflows visuais. Sem código necessário.'
              />
              <Feature
                icon={<Icon as={FiShield} w={8} h={8} />}
                title='Segurança'
                text='Multi-tenancy, autenticação JWT e controle de acesso granular.'
              />
              <Feature
                icon={<Icon as={FiTrendingUp} w={8} h={8} />}
                title='Analytics'
                text='Monitore performance, custos e uso em tempo real com dashboards completos.'
              />
              <Feature
                icon={<Icon as={FiUsers} w={8} h={8} />}
                title='Colaboração'
                text='Trabalhe em equipe, compartilhe agentes e gerencie permissões facilmente.'
              />
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={20}>
        <Container maxW='container.xl'>
          <Stack spacing={12}>
            <Stack spacing={4} align='center' textAlign='center'>
              <Heading>Planos para Todos</Heading>
              <Text fontSize='lg' color='gray.600' maxW='2xl'>
                Comece grátis e escale conforme sua necessidade
              </Text>
            </Stack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              {[
                {
                  name: 'Starter',
                  price: 'Grátis',
                  features: ['3 agentes', '1.000 mensagens/mês', 'Suporte básico', 'Modelos básicos']
                },
                {
                  name: 'Pro',
                  price: 'R$ 99/mês',
                  features: ['20 agentes', '50.000 mensagens/mês', 'Suporte prioritário', 'Todos os modelos', 'RAG ilimitado']
                },
                {
                  name: 'Business',
                  price: 'R$ 499/mês',
                  features: ['Agentes ilimitados', 'Mensagens ilimitadas', 'Suporte 24/7', 'Custom models', 'White-label', 'API dedicada']
                }
              ].map((plan, idx) => (
                <Box
                  key={idx}
                  bg='white'
                  p={8}
                  rounded='xl'
                  shadow={idx === 1 ? 'xl' : 'md'}
                  border='2px'
                  borderColor={idx === 1 ? 'purple.500' : 'transparent'}
                  transform={idx === 1 ? 'scale(1.05)' : 'none'}
                >
                  <Stack spacing={6}>
                    <Box>
                      <Text fontSize='2xl' fontWeight='bold'>{plan.name}</Text>
                      <Text fontSize='4xl' fontWeight='bold' mt={2}>{plan.price}</Text>
                    </Box>
                    <VStack spacing={3} align='start'>
                      {plan.features.map((feature, i) => (
                        <HStack key={i}>
                          <Icon as={FiZap} color='purple.500' />
                          <Text>{feature}</Text>
                        </HStack>
                      ))}
                    </VStack>
                    <Button
                      colorScheme={idx === 1 ? 'purple' : 'gray'}
                      size='lg'
                      w='full'
                      onClick={() => navigate('/register')}
                    >
                      {idx === 0 ? 'Começar Grátis' : 'Começar Agora'}
                    </Button>
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box py={20}>
        <Container maxW='container.xl'>
          <Stack spacing={12}>
            <Stack spacing={4} align='center' textAlign='center'>
              <Heading>O Que Nossos Clientes Dizem</Heading>
            </Stack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <Testimonial
                name='Maria Silva'
                role='CEO, TechStart'
                content='O AI Maestro revolucionou nossa operação. Agora conseguimos atender 10x mais clientes com a mesma equipe.'
              />
              <Testimonial
                name='João Santos'
                role='CTO, InnovateLab'
                content='A integração multi-LLM é perfeita. Conseguimos escolher o melhor modelo para cada caso de uso.'
              />
              <Testimonial
                name='Ana Costa'
                role='Head of Product, DataFlow'
                content='Implementamos em 2 dias. A plataforma é incrivelmente intuitiva e poderosa ao mesmo tempo.'
              />
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* CTA Final */}
      <Box
        bgGradient='linear(to-r, purple.600, pink.600)'
        py={20}
        color='white'
      >
        <Container maxW='container.xl'>
          <Stack spacing={8} align='center' textAlign='center'>
            <Heading fontSize='4xl'>
              Pronto para Começar?
            </Heading>
            <Text fontSize='xl' maxW='2xl'>
              Junte-se a milhares de empresas que já transformaram suas operações com IA
            </Text>
            <Button
              size='lg'
              bg='white'
              color='purple.600'
              _hover={{ bg: 'gray.100' }}
              onClick={() => navigate('/register')}
              leftIcon={<FiZap />}
            >
              Começar Gratuitamente
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        bg={useColorModeValue('gray.50', 'gray.900')}
        py={10}
      >
        <Container maxW='container.xl'>
          <Flex justify='space-between' align='center' flexWrap='wrap' gap={4}>
            <Text>© 2024 AI Maestro. Todos os direitos reservados.</Text>
            <HStack spacing={6}>
              <Text cursor='pointer' _hover={{ color: 'purple.500' }}>Termos</Text>
              <Text cursor='pointer' _hover={{ color: 'purple.500' }}>Privacidade</Text>
              <Text cursor='pointer' _hover={{ color: 'purple.500' }}>Contato</Text>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

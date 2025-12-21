import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  Text,
} from '@chakra-ui/react'
import { FiBell, FiChevronDown, FiMenu } from 'react-icons/fi'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Sidebar from './Sidebar'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Flex>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Box flex="1" ml={{ base: 0, md: 60 }}>
          {/* Header */}
          <Flex
            px={4}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.800')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent="space-between"
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              onClick={() => {}}
              variant="outline"
              aria-label="open menu"
              icon={<FiMenu />}
            />

            <Text
              display={{ base: 'flex', md: 'none' }}
              fontSize="2xl"
              fontWeight="bold"
              color="brand.600"
            >
              AI-Maestro
            </Text>

            <HStack spacing={{ base: '2', md: '6' }}>
              <IconButton
                size="lg"
                variant="ghost"
                aria-label="notifications"
                icon={<FiBell />}
              />
              
              <Flex alignItems="center">
                <Menu>
                  <MenuButton
                    py={2}
                    transition="all 0.3s"
                    _focus={{ boxShadow: 'none' }}
                  >
                    <HStack>
                      <Avatar
                        size="sm"
                        name={user?.full_name || user?.username}
                      />
                      <VStack
                        display={{ base: 'none', md: 'flex' }}
                        alignItems="flex-start"
                        spacing="1px"
                        ml="2"
                      >
                        <Text fontSize="sm">{user?.full_name || user?.username}</Text>
                        <Text fontSize="xs" color="gray.600">
                          {user?.plan}
                        </Text>
                      </VStack>
                      <Box display={{ base: 'none', md: 'flex' }}>
                        <FiChevronDown />
                      </Box>
                    </HStack>
                  </MenuButton>
                  
                  <MenuList
                    bg={useColorModeValue('white', 'gray.900')}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                  >
                    <MenuItem onClick={() => navigate('/settings')}>Configurações</MenuItem>
                    <MenuItem>Ajuda</MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={handleLogout}>Sair</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </HStack>
          </Flex>

          {/* Page Content */}
          <Box p={4}>
            <Outlet />
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}

function VStack({ children, ...props }) {
  return <Stack direction="column" {...props}>{children}</Stack>
}

import {
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
} from '@chakra-ui/react'
import { FiHome, FiUsers, FiBarChart2, FiSettings, FiShield } from 'react-icons/fi'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const LinkItems = [
  { name: 'Dashboard', icon: FiHome, path: '/app' },
  { name: 'Agentes', icon: FiUsers, path: '/app/agents' },
  { name: 'Analytics', icon: FiBarChart2, path: '/app/analytics' },
  { name: 'Configurações', icon: FiSettings, path: '/app/settings' },
]

export default function Sidebar() {
  const { user } = useAuthStore()
  
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      display={{ base: 'none', md: 'block' }}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold" color="brand.600">
          AI-Maestro
        </Text>
      </Flex>
      
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} path={link.path}>
          {link.name}
        </NavItem>
      ))}
      
      {/* Link do Admin - apenas para super admins */}
      {user?.is_superadmin && (
        <NavItem icon={FiShield} path="/app/admin">
          Admin Panel
        </NavItem>
      )}
    </Box>
  )
}
    </Box>
  )
}

function NavItem({ icon, path, children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname === path

  return (
    <Box
      as="button"
      onClick={() => navigate(path)}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      w="full"
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? 'brand.500' : 'transparent'}
        color={isActive ? 'white' : 'inherit'}
        _hover={{
          bg: isActive ? 'brand.600' : 'brand.50',
          color: isActive ? 'white' : 'brand.600',
        }}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  )
}

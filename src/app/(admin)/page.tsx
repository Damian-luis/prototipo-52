import Link from 'next/link';
import { Stack, Button } from '@chakra-ui/react';

<Stack direction={{ base: "column", md: "row" }} spacing={4} mb={8} justify="center">
  <Link href="/signin"><Button colorScheme="blue" size="lg">Iniciar Sesión</Button></Link>
  <Link href="/signup"><Button variant="outline" colorScheme="blue" size="lg">Registrarse</Button></Link>
  <Link href="/admin"><Button variant="ghost" colorScheme="blue" size="lg">Ver Dashboard</Button></Link>
</Stack> 
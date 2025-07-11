'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestContractPage() {
  const router = useRouter();

  useEffect(() => {
    // Obtener todos los usuarios
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const freelancers = users.filter((u: any) => u.role === 'freelancer');
    
    if (freelancers.length === 0) {
      alert('No hay freelancers registrados. Por favor, registra un freelancer primero.');
      router.push('/signup');
      return;
    }

    // Tomar el primer freelancer
    const freelancer = freelancers[0];
    
    // Crear un contrato de prueba
    const testContract = {
      id: 'test-' + Date.now(),
      title: 'Desarrollo de Landing Page - PRUEBA',
      description: 'Este es un contrato de prueba para demostrar el flujo de firma',
      freelancerId: freelancer._id || freelancer.id,
      freelancerName: `${freelancer.firstName} ${freelancer.lastName}`,
      clientId: '1',
      clientName: 'Empresa ABC',
      value: 5000,
      currency: 'USD',
      paymentTerms: 'fixed',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      signatures: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      terms: 'Este es un contrato de prueba. El freelancer se compromete a desarrollar una landing page responsive.',
      deliverables: ['Landing page responsive', 'Código fuente', 'Documentación']
    };

    // Guardar el contrato
    const existingContracts = JSON.parse(localStorage.getItem('contracts') || '[]');
    existingContracts.push(testContract);
    localStorage.setItem('contracts', JSON.stringify(existingContracts));

    alert(`¡Contrato de prueba creado! 
    
Freelancer: ${freelancer.firstName} ${freelancer.lastName}
Email: ${freelancer.email}

Ahora puedes:
1. Iniciar sesión como admin para ver y firmar el contrato
2. Iniciar sesión como freelancer (${freelancer.email}) para ver y firmar el contrato`);

    router.push('/signin');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Creando contrato de prueba...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
      </div>
    </div>
  );
} 
const axios = require('axios');

// Configuración
const API_BASE_URL = 'http://localhost:3000';
const TEST_USER_ID = '68825aa67bfb4eb5dc346195'; // ID de usuario de prueba

// Función para crear notificaciones de prueba
async function createTestNotifications() {
  try {
    console.log('🔔 Creando notificaciones de prueba...');

    // Simular diferentes tipos de notificaciones
    const testNotifications = [
      {
        userId: TEST_USER_ID,
        type: 'job_application',
        title: 'Nueva aplicación recibida',
        message: 'Juan Pérez ha aplicado a tu oferta "Desarrollador Frontend React"',
        metadata: { 
          jobTitle: 'Desarrollador Frontend React', 
          professionalName: 'Juan Pérez', 
          applicationId: 'app-001',
          action: 'view_application'
        }
      },
      {
        userId: TEST_USER_ID,
        type: 'new_job_posted',
        title: 'Nueva oferta de trabajo',
        message: 'TechCorp ha publicado una nueva oferta: "Desarrollador Full Stack"',
        metadata: { 
          jobTitle: 'Desarrollador Full Stack', 
          companyName: 'TechCorp', 
          jobId: 'job-001',
          action: 'view_job'
        }
      },
      {
        userId: TEST_USER_ID,
        type: 'application_status_changed',
        title: 'Estado de aplicación actualizado',
        message: 'Tu aplicación para "Desarrollador Backend" en InnovateLab ha sido aceptada',
        metadata: { 
          jobTitle: 'Desarrollador Backend', 
          companyName: 'InnovateLab', 
          newStatus: 'accepted', 
          applicationId: 'app-002',
          action: 'view_application'
        }
      },
      {
        userId: TEST_USER_ID,
        type: 'new_message',
        title: 'Nuevo mensaje',
        message: 'María García: Hola, me interesa tu perfil para un proyecto...',
        metadata: { 
          senderName: 'María García', 
          messagePreview: 'Hola, me interesa tu perfil para un proyecto...', 
          chatRoomId: 'chat-001',
          action: 'open_chat'
        }
      },
      {
        userId: TEST_USER_ID,
        type: 'contract_signed',
        title: 'Contrato firmado',
        message: 'El contrato "Desarrollo de E-commerce" ha sido firmado exitosamente',
        metadata: { 
          contractTitle: 'Desarrollo de E-commerce', 
          contractId: 'contract-001',
          action: 'view_contract'
        }
      },
      {
        userId: TEST_USER_ID,
        type: 'payment_received',
        title: 'Pago recibido',
        message: 'Has recibido un pago de 1500 USD por el contrato "Desarrollo de API"',
        metadata: { 
          amount: 1500, 
          currency: 'USD', 
          contractTitle: 'Desarrollo de API', 
          paymentId: 'payment-001',
          action: 'view_payment'
        }
      },
      {
        userId: TEST_USER_ID,
        type: 'project_completed',
        title: 'Proyecto completado',
        message: 'El proyecto "Sistema de Gestión" ha sido marcado como completado',
        metadata: { 
          projectTitle: 'Sistema de Gestión', 
          projectId: 'project-001',
          action: 'view_project'
        }
      },
      {
        userId: TEST_USER_ID,
        type: 'evaluation_received',
        title: 'Evaluación recibida',
        message: 'DigitalSolutions te ha evaluado con 5/5 estrellas por el proyecto "App Móvil"',
        metadata: { 
          rating: 5, 
          companyName: 'DigitalSolutions', 
          projectTitle: 'App Móvil', 
          evaluationId: 'eval-001',
          action: 'view_evaluation'
        }
      }
    ];

    // Crear cada notificación
    for (const notification of testNotifications) {
      try {
        const response = await axios.post(`${API_BASE_URL}/notifications`, notification, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer test-token` // Token de prueba
          }
        });
        
        console.log(`✅ Notificación creada: ${notification.title}`);
        
        // Esperar un poco entre notificaciones
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`❌ Error creando notificación "${notification.title}":`, error.response?.data || error.message);
      }
    }

    console.log('🎉 Proceso de creación de notificaciones completado');
    
    // Verificar notificaciones creadas
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/user/${TEST_USER_ID}`);
      console.log(`📊 Total de notificaciones para el usuario: ${response.data.length}`);
    } catch (error) {
      console.error('❌ Error obteniendo notificaciones:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Función para limpiar notificaciones de prueba
async function clearTestNotifications() {
  try {
    console.log('🧹 Limpiando notificaciones de prueba...');
    
    const response = await axios.delete(`${API_BASE_URL}/notifications/user/${TEST_USER_ID}`, {
      headers: {
        'Authorization': `Bearer test-token`
      }
    });
    
    console.log('✅ Notificaciones de prueba eliminadas');
  } catch (error) {
    console.error('❌ Error limpiando notificaciones:', error.response?.data || error.message);
  }
}

// Función principal
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'create':
      await createTestNotifications();
      break;
    case 'clear':
      await clearTestNotifications();
      break;
    default:
      console.log('Uso: node test-notifications.js [create|clear]');
      console.log('  create - Crear notificaciones de prueba');
      console.log('  clear  - Limpiar notificaciones de prueba');
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  createTestNotifications,
  clearTestNotifications
}; 
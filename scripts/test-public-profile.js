const axios = require('axios');

// Configurar axios para el frontend
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

async function testPublicProfile() {
  try {
    console.log('🔍 Testing public professional profile API...');
    
    // Probar obtener perfil de profesional específico sin autenticación
    const professionalId = '68825aa67bfb4eb5dc346195'; // ID del profesional existente
    
    try {
      const profileResponse = await api.get(`/users/${professionalId}/profile/public`);
      
      console.log('✅ Public profile API response:', profileResponse.status);
      console.log('📋 Public profile data:', profileResponse.data);
      
      // Verificar campos importantes
      const profile = profileResponse.data;
      console.log('👤 Professional details:');
      console.log('  - Name:', profile.fullName);
      console.log('  - Email:', profile.email);
      console.log('  - Experience:', profile.experience);
      console.log('  - Skills:', profile.skills);
      console.log('  - Rating:', profile.rating);
      console.log('  - Completed Projects:', profile.completedProjects);
      console.log('  - Total Earnings:', profile.totalEarnings);
      console.log('  - Availability:', profile.availability);
      console.log('  - Bio:', profile.bio);
      
    } catch (error) {
      console.log('❌ Public profile failed:', error.response?.status, error.response?.data?.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testPublicProfile(); 
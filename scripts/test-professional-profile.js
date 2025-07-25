const axios = require('axios');

// Configurar axios para el frontend
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

async function testProfessionalProfile() {
  try {
    console.log('🔍 Testing professional profile API...');
    
    // 1. Hacer login para obtener token
    try {
      const loginResponse = await api.post('/auth/login', {
        email: 'creador2@gmail.com', // Usuario empresa
        password: 'password123'
      });
      
      const token = loginResponse.data.token;
      console.log('🔑 Got token:', token ? 'Token received' : 'No token');
      
      if (token) {
        // 2. Probar obtener perfil de profesional específico
        const professionalId = '68825aa67bfb4eb5dc346195'; // ID del profesional existente
        const profileResponse = await api.get(`/users/${professionalId}/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('✅ Professional profile API response:', profileResponse.status);
        console.log('📋 Professional profile data:', profileResponse.data);
        
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
        
      }
      
    } catch (error) {
      console.log('❌ Login failed:', error.response?.status, error.response?.data?.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testProfessionalProfile(); 
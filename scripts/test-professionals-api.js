const axios = require('axios');

// Configurar axios para el frontend
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

async function testProfessionalsAPI() {
  try {
    console.log('🔍 Testing professionals API...');
    
    // 1. Probar sin autenticación (debería fallar)
    try {
      const response = await api.get('/users/professionals');
      console.log('❌ Should have failed without auth:', response.data);
    } catch (error) {
      console.log('✅ Correctly failed without auth:', error.response?.status, error.response?.data?.message);
    }
    
    // 2. Probar con token inválido
    try {
      const response = await api.get('/users/professionals', {
        headers: { 'Authorization': 'Bearer invalid-token' }
      });
      console.log('❌ Should have failed with invalid token:', response.data);
    } catch (error) {
      console.log('✅ Correctly failed with invalid token:', error.response?.status, error.response?.data?.message);
    }
    
    // 3. Probar endpoint de autenticación para obtener un token válido
    try {
      const loginResponse = await api.post('/auth/login', {
        email: 'creador2@gmail.com', // Usuario empresa
        password: 'password123'
      });
      
      const token = loginResponse.data.token;
      console.log('🔑 Got token:', token ? 'Token received' : 'No token');
      
      if (token) {
        // 4. Probar con token válido
        const professionalsResponse = await api.get('/users/professionals', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('✅ Professionals API response:', professionalsResponse.status);
        console.log('📋 Professionals data:', professionalsResponse.data);
        console.log('👥 Number of professionals:', Array.isArray(professionalsResponse.data) ? professionalsResponse.data.length : 'Not an array');
      }
      
    } catch (error) {
      console.log('❌ Login failed:', error.response?.status, error.response?.data?.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testProfessionalsAPI(); 
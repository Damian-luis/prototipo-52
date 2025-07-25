const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testProfessionals() {
  try {
    console.log('🔍 Testing professionals in database...');
    
    // 1. Verificar todos los usuarios
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        accountStatus: true
      }
    });
    
    console.log('👥 All users found:', allUsers.length);
    console.log('👥 Users:', allUsers);
    
    // 2. Verificar usuarios con rol PROFESIONAL
    const professionals = await prisma.user.findMany({
      where: { role: 'PROFESIONAL' },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        accountStatus: true,
        experience: true,
        skills: true,
        availability: true,
        rating: true
      }
    });
    
    console.log('🎯 Professionals found:', professionals.length);
    console.log('🎯 Professionals:', professionals);
    
    // 3. Verificar con filtro de accountStatus
    const activeProfessionals = await prisma.user.findMany({
      where: { 
        role: 'PROFESIONAL',
        accountStatus: { in: ['ACTIVE', 'pending'] }
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        accountStatus: true
      }
    });
    
    console.log('✅ Active/pending professionals found:', activeProfessionals.length);
    console.log('✅ Active/pending professionals:', activeProfessionals);
    
    // 4. Simular la consulta completa del servicio
    const serviceQuery = await prisma.user.findMany({
      where: {
        role: 'PROFESIONAL',
        accountStatus: { in: ['ACTIVE', 'pending'] }
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
        role: true,
        experience: true,
        skills: true,
        availability: true,
        rating: true,
        bio: true,
        country: true,
        city: true,
        hourlyRate: true,
        cvUrl: true,
        cvFileName: true,
        createdAt: true,
        contracts: {
          where: { status: 'COMPLETED' },
          select: {
            id: true,
            payments: {
              where: { status: 'COMPLETED' },
              select: { amount: true }
            }
          }
        }
      },
      orderBy: { rating: 'desc' }
    });
    
    console.log('🔧 Service query result:', serviceQuery.length);
    console.log('🔧 Service query data:', serviceQuery);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProfessionals(); 
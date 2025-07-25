const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateExistingProfessional() {
  try {
    console.log('🔧 Updating existing professional...');
    
    // Buscar el usuario profesional existente
    const existingProfessional = await prisma.user.findFirst({
      where: { 
        role: 'PROFESIONAL',
        email: 'creador@gmail.com'
      }
    });
    
    if (!existingProfessional) {
      console.log('❌ Professional not found');
      return;
    }
    
    console.log('👤 Found professional:', existingProfessional.fullName);
    
    // Actualizar con datos de prueba
    const updatedProfessional = await prisma.user.update({
      where: { id: existingProfessional.id },
      data: {
        experience: 5,
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Next.js'],
        availability: 'available',
        rating: 4.8,
        bio: 'Desarrollador Full Stack con 5 años de experiencia en tecnologías modernas. Especializado en React, Node.js y TypeScript.',
        country: 'Argentina',
        city: 'Buenos Aires',
        hourlyRate: 45,
        accountStatus: 'ACTIVE'
      }
    });
    
    console.log('✅ Professional updated successfully');
    console.log('📋 Updated data:', {
      id: updatedProfessional.id,
      fullName: updatedProfessional.fullName,
      email: updatedProfessional.email,
      experience: updatedProfessional.experience,
      skills: updatedProfessional.skills,
      availability: updatedProfessional.availability,
      rating: updatedProfessional.rating,
      bio: updatedProfessional.bio,
      country: updatedProfessional.country,
      city: updatedProfessional.city,
      hourlyRate: updatedProfessional.hourlyRate,
      accountStatus: updatedProfessional.accountStatus
    });
    
  } catch (error) {
    console.error('❌ Error updating professional:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateExistingProfessional(); 
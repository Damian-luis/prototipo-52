const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const testProfessionals = [
  {
    email: 'juan.perez@example.com',
    fullName: 'Juan Pérez',
    password: '$2b$10$example.hash',
    role: 'PROFESIONAL',
    accountStatus: 'ACTIVE',
    experience: 5,
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    availability: 'available',
    rating: 4.8,
    bio: 'Desarrollador Full Stack con 5 años de experiencia en tecnologías modernas',
    country: 'Argentina',
    city: 'Buenos Aires',
    hourlyRate: 45,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    email: 'maria.garcia@example.com',
    fullName: 'María García',
    password: '$2b$10$example.hash',
    role: 'PROFESIONAL',
    accountStatus: 'ACTIVE',
    experience: 3,
    skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
    availability: 'available',
    rating: 4.6,
    bio: 'Diseñadora UX/UI apasionada por crear experiencias digitales intuitivas',
    country: 'México',
    city: 'Ciudad de México',
    hourlyRate: 35,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    email: 'carlos.rodriguez@example.com',
    fullName: 'Carlos Rodríguez',
    password: '$2b$10$example.hash',
    role: 'PROFESIONAL',
    accountStatus: 'ACTIVE',
    experience: 7,
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
    availability: 'busy',
    rating: 4.9,
    bio: 'Desarrollador Backend senior especializado en Python y arquitecturas escalables',
    country: 'Colombia',
    city: 'Bogotá',
    hourlyRate: 55,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    email: 'ana.martinez@example.com',
    fullName: 'Ana Martínez',
    password: '$2b$10$example.hash',
    role: 'PROFESIONAL',
    accountStatus: 'ACTIVE',
    experience: 4,
    skills: ['JavaScript', 'Vue.js', 'CSS', 'SASS', 'Webpack'],
    availability: 'available',
    rating: 4.7,
    bio: 'Desarrolladora Frontend con experiencia en frameworks modernos',
    country: 'España',
    city: 'Madrid',
    hourlyRate: 40,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    email: 'luis.hernandez@example.com',
    fullName: 'Luis Hernández',
    password: '$2b$10$example.hash',
    role: 'PROFESIONAL',
    accountStatus: 'ACTIVE',
    experience: 6,
    skills: ['DevOps', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux'],
    availability: 'available',
    rating: 4.5,
    bio: 'Ingeniero DevOps con experiencia en automatización y infraestructura como código',
    country: 'Chile',
    city: 'Santiago',
    hourlyRate: 50,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  }
];

async function createTestProfessionals() {
  try {
    console.log('Creando profesionales de prueba...');
    
    for (const professional of testProfessionals) {
      const existingUser = await prisma.user.findUnique({
        where: { email: professional.email }
      });
      
      if (!existingUser) {
        await prisma.user.create({
          data: professional
        });
        console.log(`✅ Profesional creado: ${professional.fullName}`);
      } else {
        console.log(`⏭️  Profesional ya existe: ${professional.fullName}`);
      }
    }
    
    console.log('🎉 Profesionales de prueba creados exitosamente');
  } catch (error) {
    console.error('❌ Error creando profesionales:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestProfessionals(); 
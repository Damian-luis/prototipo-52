"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Navbar from "@/components/ui/navigation/Navbar";
import StatsCard from "@/components/ui/stats/StatsCard";
import Card from "@/components/ui/card/Card";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirigir según el rol del usuario
      switch (user.role) {
        case 'ADMIN':
          router.push('/admin');
          break;
        case 'EMPRESA':
          router.push('/empresa');
          break;
        case 'PROFESIONAL':
          router.push('/profesional');
          break;
        case 'ESPECIALISTA':
          router.push('/especialista');
          break;
        default:
          router.push('/');
      }
    }
    // Si no está autenticado, no redirige, muestra la landing
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    // Mostrar la landing si no está autenticado
    return <LandingPage />;
  }

  // Mostrar un loading mientras se determina la redirección
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-25 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 dark:from-primary-900/20 dark:to-secondary-900/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%230284c7&quot; fill-opacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Logo */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl shadow-xl mb-8">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                Plataforma de <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 bg-clip-text text-transparent">Outsourcing</span> Inteligente
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
                Conectamos empresas con profesionales talentosos usando IA avanzada. 
                Gestión integral de proyectos, contratos y pagos en una sola plataforma moderna y segura.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/signin">
                <button className="group relative px-10 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg">
                  <span className="relative z-10">Iniciar Sesión</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-accent-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-10 py-4 bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-300 border-2 border-primary-200 dark:border-primary-700 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-primary-50 dark:hover:bg-gray-700 text-lg">
                  Registrarse Gratis
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Profesionales Activos"
                value="2,847"
                change={{ value: 12, type: "increase" }}
                trend="up"
                color="primary"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                }
              />
              <StatsCard
                title="Empresas Registradas"
                value="156"
                change={{ value: 8, type: "increase" }}
                trend="up"
                color="secondary"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
              />
              <StatsCard
                title="Proyectos Completados"
                value="1,234"
                change={{ value: 3, type: "decrease" }}
                trend="down"
                color="success"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatsCard
                title="Satisfacción Cliente"
                value="98%"
                change={{ value: 2, type: "increase" }}
                trend="up"
                color="info"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>
          </div>
        </section>

        {/* FEATURES HIGHLIGHTS */}
        <section className="py-24 bg-gradient-to-br from-gray-50 to-primary-25 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                ¿Por qué elegir nuestra plataforma?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Tecnología de vanguardia que revoluciona la gestión de outsourcing con IA y blockchain
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <Card hover gradient className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">IA para Matching</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  Algoritmos de IA avanzados que analizan habilidades, experiencia y compatibilidad para encontrar el profesional perfecto para cada proyecto.
                </p>
              </Card>

              <Card hover gradient className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Gestión Inteligente</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  Control completo de proyectos con seguimiento en tiempo real, automatización de tareas y análisis de rendimiento avanzado.
                </p>
              </Card>

              <Card hover gradient className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Seguridad Blockchain</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  Contratos inteligentes, pagos automatizados y transacciones seguras con tecnología blockchain de última generación.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* DETAILED FEATURES */}
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Funcionalidades Principales
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Todo lo que necesitas para gestionar tu outsourcing de manera eficiente y moderna
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "💼",
                  title: "Portal de Empresas",
                  description: "Gestiona proyectos, equipos, contratos y pagos con paneles de rendimiento en tiempo real."
                },
                {
                  icon: "👨‍💻",
                  title: "Portal de Profesionales",
                  description: "Actualiza tu perfil, gestiona proyectos, pagos y recibe asesorías personalizadas."
                },
                {
                  icon: "📊",
                  title: "Analytics Avanzados",
                  description: "Reportes detallados, métricas de rendimiento y insights para optimizar tu operación."
                },
                {
                  icon: "🔔",
                  title: "Notificaciones Inteligentes",
                  description: "Alertas en tiempo real para cambios en proyectos, pagos y asesorías."
                },
                {
                  icon: "🎯",
                  title: "Asesoría Profesional",
                  description: "Sesiones de asesoría en salud, bienestar laboral y desarrollo profesional."
                },
                {
                  icon: "⚡",
                  title: "Automatización Total",
                  description: "Flujos automáticos de contratación, pagos y gestión de proyectos."
                }
              ].map((feature, index) => (
                <Card key={index} hover className="text-center">
                  <div className="text-5xl mb-8">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-24 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Lo que dicen nuestros clientes
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Empresas y profesionales que confían en nuestra plataforma
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "María González",
                  role: "CEO, TechStart",
                  content: "La plataforma ha revolucionado nuestra forma de contratar talento. La IA nos ayuda a encontrar profesionales perfectos para cada proyecto.",
                  avatar: "/images/user/user-02.jpg"
                },
                {
                  name: "Carlos Rodríguez",
                  role: "Freelancer Senior",
                  content: "Excelente plataforma para gestionar proyectos y recibir pagos de forma segura. La automatización me ahorra mucho tiempo.",
                  avatar: "/images/user/user-03.jpg"
                },
                {
                  name: "Ana Martínez",
                  role: "HR Manager, InnovateCorp",
                  content: "La gestión de contratos y pagos es impecable. Hemos aumentado nuestra productividad en un 40% desde que usamos la plataforma.",
                  avatar: "/images/user/user-04.jpg"
                }
              ].map((testimonial, index) => (
                <Card key={index} className="text-center">
                  <div className="mb-6">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                    />
                    <p className="text-gray-600 dark:text-gray-300 italic text-lg mb-4">
                      "{testimonial.content}"
                    </p>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 bg-gradient-to-br from-primary-600 to-accent-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              ¿Listo para transformar tu outsourcing?
            </h2>
            <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto">
              Únete a cientos de empresas y profesionales que ya confían en nuestra plataforma para optimizar sus procesos de outsourcing con tecnología de vanguardia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/signup?type=empresa">
                <button className="group relative px-10 py-4 bg-white text-primary-700 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg">
                  <span className="relative z-10">Registrarse como Empresa</span>
                  <div className="absolute inset-0 bg-gray-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
              <Link href="/signup?type=profesional">
                <button className="px-10 py-4 bg-transparent text-white border-2 border-white rounded-2xl font-semibold hover:bg-white hover:text-primary-700 transition-all duration-300 transform hover:-translate-y-1 text-lg">
                  Registrarse como Profesional
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">FreelaSaaS</span>
              </div>
              <p className="text-gray-400 mb-4">
                La plataforma líder en outsourcing inteligente que conecta empresas con profesionales talentosos.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Características</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Precios</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integraciones</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">Acerca de</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Carreras</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contacto</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Centro de ayuda</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentación</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Estado del servicio</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Seguridad</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 FreelaSaaS. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacidad
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 
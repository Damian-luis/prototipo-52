"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirigir según el rol del usuario
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/freelancer');
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <main className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* HERO */}
      <section className="max-w-5xl mx-auto px-4 pt-24 pb-16 text-center flex flex-col items-center">
        <img src="/images/logo/logo.svg" alt="FreelaSaaS Logo" className="h-14 mb-6" />
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 dark:text-white mb-6 leading-tight">
          Gestiona y paga freelancers <span className="text-blue-600">en todo el mundo</span> con un solo clic
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-200 mb-8 max-w-2xl mx-auto">
          FreelaSaaS es la plataforma integral para empresas y freelancers que buscan eficiencia, cumplimiento y escalabilidad internacional.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <Link href="/signin"><button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Iniciar Sesión</button></Link>
          <Link href="/signup"><button className="bg-white text-blue-700 border border-blue-600 px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-50 transition dark:bg-gray-900 dark:text-white dark:border-white">Registrarse</button></Link>
        </div>
        <div className="w-full flex justify-center mt-8">
          <img src="/images/grid-image/image-01.png" alt="Dashboard FreelaSaaS" width={900} height={480} className="rounded-xl shadow-xl border border-blue-100 dark:border-gray-800" />
        </div>
      </section>
      {/* HIGHLIGHTS */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow flex flex-col items-center text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold mb-2 text-blue-800 dark:text-white">Automatización total</h3>
          <p className="text-gray-600 dark:text-gray-300">Reduce costos y tiempos operativos con flujos automáticos de contratación y pago.</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow flex flex-col items-center text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2 text-blue-800 dark:text-white">IA para recomendaciones</h3>
          <p className="text-gray-600 dark:text-gray-300">Encuentra el mejor talento con algoritmos inteligentes y análisis de desempeño.</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow flex flex-col items-center text-center">
          <div className="text-4xl mb-4">🌎</div>
          <h3 className="text-xl font-bold mb-2 text-blue-800 dark:text-white">Escalabilidad internacional</h3>
          <p className="text-gray-600 dark:text-gray-300">Gestiona freelancers y empresas en cualquier país, cumpliendo normativas locales.</p>
        </div>
      </section>
      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-blue-900 dark:text-white mb-10 text-center">Funcionalidades principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow flex flex-col items-center text-center">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-lg font-bold mb-2 text-blue-800 dark:text-white">Gestión de Talento</h3>
            <p className="text-gray-600 dark:text-gray-300">Publica ofertas, recibe recomendaciones inteligentes y haz seguimiento de procesos de selección en múltiples países.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow flex flex-col items-center text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-bold mb-2 text-blue-800 dark:text-white">Contratos y Pagos</h3>
            <p className="text-gray-600 dark:text-gray-300">Genera, firma y gestiona contratos electrónicos. Automatiza pagos, deducciones fiscales y cumple normativas internacionales.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow flex flex-col items-center text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-bold mb-2 text-blue-800 dark:text-white">Panel Personalizado</h3>
            <p className="text-gray-600 dark:text-gray-300">Visualiza métricas clave, tareas, alertas y reportes exportables en PDF/Excel.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow flex flex-col items-center text-center">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-lg font-bold mb-2 text-blue-800 dark:text-white">Integraciones</h3>
            <p className="text-gray-600 dark:text-gray-300">Conecta con Upwork, Fiverr, LinkedIn, ERPs y más para potenciar tu operación.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow flex flex-col items-center text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-bold mb-2 text-blue-800 dark:text-white">Soporte y Seguridad</h3>
            <p className="text-gray-600 dark:text-gray-300">Sistema de tickets, validación de accesos y cumplimiento normativo internacional.</p>
          </div>
        </div>
      </section>
      {/* TESTIMONIALS */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-8 text-center">Lo que dicen nuestros usuarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow flex flex-col items-center text-center">
            <img src="/images/avatar1.png" alt="Sofía Martínez" className="rounded-full mb-4 w-16 h-16" />
            <p className="text-gray-700 dark:text-gray-200 mb-4">“FreelaSaaS nos permitió contratar y pagar talento en 5 países sin dolores de cabeza. La automatización y el soporte son excelentes.”</p>
            <div className="font-bold text-blue-800 dark:text-white">Sofía Martínez</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">HR Manager, TechGlobal</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow flex flex-col items-center text-center">
            <img src="/images/avatar2.png" alt="Carlos Méndez" className="rounded-full mb-4 w-16 h-16" />
            <p className="text-gray-700 dark:text-gray-200 mb-4">“Ahora recibo mis pagos a tiempo y tengo contratos claros. La plataforma es muy fácil de usar y el soporte responde rápido.”</p>
            <div className="font-bold text-blue-800 dark:text-white">Carlos Méndez</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Freelancer Fullstack</div>
          </div>
        </div>
      </section>
      {/* PRICING */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-8 text-center">Planes y precios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-xl p-8 shadow flex flex-col items-center text-center border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <h3 className="text-xl font-bold mb-2 text-blue-800 dark:text-white">Starter</h3>
            <div className="text-3xl font-extrabold mb-2">$0</div>
            <div className="mb-4 text-gray-600 dark:text-gray-300">Hasta 3 contrataciones activas. Soporte básico.</div>
            <ul className="mb-6 text-gray-700 dark:text-gray-200 text-left">
              <li className="mb-1">• Gestión de talento</li>
              <li className="mb-1">• Contratos electrónicos</li>
              <li className="mb-1">• Panel básico</li>
            </ul>
            <button className="px-6 py-2 rounded-lg font-semibold shadow bg-white text-blue-700 border border-blue-600 hover:bg-blue-50 dark:bg-gray-900 dark:text-white dark:border-white">Comenzar gratis</button>
          </div>
          <div className="rounded-xl p-8 shadow flex flex-col items-center text-center border-2 border-blue-600 bg-blue-50 dark:bg-blue-900/30">
            <h3 className="text-xl font-bold mb-2 text-blue-800 dark:text-white">Pro</h3>
            <div className="text-3xl font-extrabold mb-2">$49/mes</div>
            <div className="mb-4 text-gray-600 dark:text-gray-300">Hasta 50 contrataciones activas. Integraciones y reportes avanzados.</div>
            <ul className="mb-6 text-gray-700 dark:text-gray-200 text-left">
              <li className="mb-1">• Todo en Starter</li>
              <li className="mb-1">• Integraciones externas</li>
              <li className="mb-1">• Reportes exportables</li>
              <li className="mb-1">• Soporte prioritario</li>
            </ul>
            <button className="px-6 py-2 rounded-lg font-semibold shadow bg-blue-600 text-white hover:bg-blue-700">Probar Pro</button>
          </div>
          <div className="rounded-xl p-8 shadow flex flex-col items-center text-center border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <h3 className="text-xl font-bold mb-2 text-blue-800 dark:text-white">Enterprise</h3>
            <div className="text-3xl font-extrabold mb-2">Custom</div>
            <div className="mb-4 text-gray-600 dark:text-gray-300">Para empresas con operaciones globales y necesidades avanzadas.</div>
            <ul className="mb-6 text-gray-700 dark:text-gray-200 text-left">
              <li className="mb-1">• Todo en Pro</li>
              <li className="mb-1">• Onboarding personalizado</li>
              <li className="mb-1">• Soporte dedicado</li>
              <li className="mb-1">• Cumplimiento fiscal avanzado</li>
            </ul>
            <button className="px-6 py-2 rounded-lg font-semibold shadow bg-white text-blue-700 border border-blue-600 hover:bg-blue-50 dark:bg-gray-900 dark:text-white dark:border-white">Contactar ventas</button>
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-8 text-center">Preguntas frecuentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow">
            <div className="font-bold text-blue-700 dark:text-blue-300 mb-2">¿Puedo gestionar freelancers en cualquier país?</div>
            <div className="text-gray-600 dark:text-gray-300">Sí, FreelaSaaS está diseñado para operaciones internacionales y cumple normativas locales.</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow">
            <div className="font-bold text-blue-700 dark:text-blue-300 mb-2">¿Cómo funciona la firma de contratos?</div>
            <div className="text-gray-600 dark:text-gray-300">Puedes generar y firmar contratos electrónicos legalmente válidos desde la plataforma.</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow">
            <div className="font-bold text-blue-700 dark:text-blue-300 mb-2">¿Qué métodos de pago soportan?</div>
            <div className="text-gray-600 dark:text-gray-300">Transferencias bancarias, PayPal, criptomonedas y más, según el país del freelancer.</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow">
            <div className="font-bold text-blue-700 dark:text-blue-300 mb-2">¿Puedo exportar reportes?</div>
            <div className="text-gray-600 dark:text-gray-300">Sí, puedes exportar reportes en PDF y Excel desde el panel de control.</div>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="w-full py-8 text-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-800 mt-8">
        &copy; {new Date().getFullYear()} FreelaSaaS. Todos los derechos reservados.
      </footer>
    </main>
  );
} 
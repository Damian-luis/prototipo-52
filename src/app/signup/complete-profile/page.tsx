'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from '@/icons';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/supabase';

interface FreelancerProfile {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  country: string;
  city: string;
  skills: string[];
  bio: string;
  hourlyRate: number;
  languages: { name: string; level: string }[];
  paypal: { email: string };
  wallets: { address: string; network: string }[];
}

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, supabaseUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profile, setProfile] = useState<FreelancerProfile>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'profesional',
    phone: '',
    country: '',
    city: '',
    skills: [],
    bio: '',
    hourlyRate: 0,
    languages: [{ name: '', level: 'Intermedio' }],
    paypal: { email: '' },
    wallets: []
  });

  useEffect(() => {
    // Verificar que el usuario esté autenticado
    if (!supabaseUser) {
      router.push('/signin');
      return;
    }
    
    // Cargar datos del usuario desde Supabase
    const loadUserData = async () => {
      if (supabaseUser.id) {
        try {
          const userData = await userService.getUserById(supabaseUser.id);
          if (userData) {
            setProfile(prev => ({
              ...prev,
              firstName: userData.name?.split(' ')[0] || '',
              lastName: userData.name?.split(' ').slice(1).join(' ') || '',
              email: userData.email || '',
              role: userData.role || 'profesional'
            }));
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };
    
    loadUserData();
  }, [supabaseUser, router]);

  const handleAddSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleAddLanguage = () => {
    setProfile(prev => ({
      ...prev,
      languages: [...prev.languages, { name: '', level: 'Intermedio' }]
    }));
  };

  const handleRemoveLanguage = (index: number) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const handleAddWallet = () => {
    setProfile(prev => ({
      ...prev,
      wallets: [...prev.wallets, { address: '', network: 'Ethereum' }]
    }));
  };

  const handleRemoveWallet = (index: number) => {
    setProfile(prev => ({
      ...prev,
      wallets: prev.wallets.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!supabaseUser?.id) {
      alert('Usuario no autenticado');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Actualizar perfil del usuario en Supabase
      const updateData = {
        phone: profile.phone,
        country: profile.country,
        city: profile.city,
        bio: profile.bio,
        hourly_rate: profile.hourlyRate,
        skills: profile.skills,
        languages: profile.languages,
        paypal_email: profile.paypal.email,
        crypto_wallets: profile.wallets,
        profile_completed: true,
        updated_at: new Date().toISOString()
      };

      const result = await userService.updateUser(supabaseUser.id, updateData);
      
      // updateUser no retorna un objeto con success, solo void o error
      // Si no hay error, la operación fue exitosa
      
      // Enviar a webhook de n8n para IA (solo para análisis)
      try {
        const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://automation-biya.useteam.io/webhook/251e2883-46b7-4d3a-9fdf-97781cf6a116';
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'profile_completed',
            user_id: supabaseUser.id,
            profile_data: updateData
          })
        });
      } catch (error) {
        console.error('Error enviando a webhook de IA:', error);
        // Continuar aunque falle el webhook
      }
      
      // Redirigir al dashboard
      router.push('/freelancer');
      
    } catch (error) {
      console.error('Error al completar registro:', error);
      alert('Error al completar el registro. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = (step: number): boolean => {
    switch(step) {
      case 1:
        return profile.phone !== '' && profile.country !== '' && profile.city !== '';
      case 2:
        return profile.skills.length > 0 && profile.bio !== '' && profile.hourlyRate > 0;
      case 3:
        return profile.languages.some(l => l.name !== '') && 
               (profile.paypal.email !== '' || profile.wallets.some(w => w.address !== ''));
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/signup"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeft />
            Volver al registro
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Completa tu perfil de Freelancer
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Por favor, proporciona información adicional para completar tu registro
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Paso {currentStep} de 3</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); }}>
            {/* Step 1: Información Personal */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      País <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={profile.country}
                      onChange={(e) => setProfile({...profile, country: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    >
                      <option value="">Selecciona un país</option>
                      <option value="Argentina">Argentina</option>
                      <option value="México">México</option>
                      <option value="Colombia">Colombia</option>
                      <option value="España">España</option>
                      <option value="Chile">Chile</option>
                      <option value="Perú">Perú</option>
                      <option value="Uruguay">Uruguay</option>
                      <option value="Venezuela">Venezuela</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ciudad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({...profile, city: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="Buenos Aires"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Habilidades y Experiencia */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Habilidades y Experiencia</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Habilidades <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="Ej: React, Node.js, Python"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
                    >
                      Agregar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 text-brand-600 hover:text-brand-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Biografía <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="Cuéntanos sobre tu experiencia y especialidades..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tarifa por hora (USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={profile.hourlyRate}
                    onChange={(e) => setProfile({...profile, hourlyRate: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="50"
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Idiomas y Métodos de Pago */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Idiomas y Métodos de Pago</h2>
                
                {/* Idiomas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Idiomas <span className="text-red-500">*</span>
                  </label>
                  {profile.languages.map((lang, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={lang.name}
                        onChange={(e) => {
                          const newLangs = [...profile.languages];
                          newLangs[index].name = e.target.value;
                          setProfile({...profile, languages: newLangs});
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Idioma"
                      />
                      <select
                        value={lang.level}
                        onChange={(e) => {
                          const newLangs = [...profile.languages];
                          newLangs[index].level = e.target.value;
                          setProfile({...profile, languages: newLangs});
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="Básico">Básico</option>
                        <option value="Intermedio">Intermedio</option>
                        <option value="Avanzado">Avanzado</option>
                        <option value="Nativo">Nativo</option>
                      </select>
                      {profile.languages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddLanguage}
                    className="text-brand-500 hover:text-brand-600 text-sm"
                  >
                    + Agregar otro idioma
                  </button>
                </div>

                {/* PayPal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email de PayPal
                  </label>
                  <input
                    type="email"
                    value={profile.paypal.email}
                    onChange={(e) => setProfile({...profile, paypal: { email: e.target.value }})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="tu-email@paypal.com"
                  />
                </div>

                {/* Wallets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Billeteras Crypto
                  </label>
                  {profile.wallets.map((wallet, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={wallet.address}
                        onChange={(e) => {
                          const newWallets = [...profile.wallets];
                          newWallets[index].address = e.target.value;
                          setProfile({...profile, wallets: newWallets});
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="0x..."
                      />
                      <select
                        value={wallet.network}
                        onChange={(e) => {
                          const newWallets = [...profile.wallets];
                          newWallets[index].network = e.target.value;
                          setProfile({...profile, wallets: newWallets});
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="Ethereum">Ethereum</option>
                        <option value="Polygon">Polygon</option>
                        <option value="BSC">BSC</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveWallet(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddWallet}
                    className="text-brand-500 hover:text-brand-600 text-sm"
                  >
                    + Agregar billetera
                  </button>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Nota:</strong> Debes proporcionar al menos un método de pago (PayPal o billetera crypto) para recibir pagos.
                  </p>
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className={`px-6 py-2 rounded-lg ${
                  currentStep === 1 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                disabled={currentStep === 1}
              >
                Anterior
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep(currentStep)) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      alert('Por favor, completa todos los campos requeridos');
                    }
                  }}
                  className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!validateStep(3) || isSubmitting}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    !validateStep(3) || isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-brand-500 text-white hover:bg-brand-600'
                  }`}
                >
                  {isSubmitting ? 'Completando registro...' : 'Completar Registro'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
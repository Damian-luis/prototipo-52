"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import Card from "@/components/ui/card/Card";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function SignInForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!form.email || !form.password) {
      setError("Todos los campos son obligatorios");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(form.email, form.password);
      
      if (result.success) {
        // Login successful, redirect based on user role
        // Wait a moment for the auth state to update
        setTimeout(() => {
          // Get the user from localStorage to determine the role
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            console.log('Redirecting user with role:', user.role);
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
          } else {
            router.push('/');
          }
        }, 50);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (userData: { user: any; access_token: string; refresh_token: string }) => {
    try {
      const result = await loginWithGoogle(userData);
      
      if (result.success) {
        // Login successful, redirect based on user role
        setTimeout(() => {
          // Get the user from localStorage to determine the role
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            console.log('Redirecting Google user with role:', user.role);
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
          } else {
            router.push('/');
          }
        }, 50);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error en login con Google:', error);
      setError('Error al iniciar sesión con Google. Por favor, intenta nuevamente.');
    }
  };

  const handleGoogleError = (error: string) => {
    setError(error);
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bienvenido de vuelta
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Inicia sesión en tu cuenta para continuar
        </p>
      </div>

      {/* Form */}
      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-error-50 dark:bg-error-500/10 border border-error-200 dark:border-error-500/20 rounded-xl p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-error-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-error-800 dark:text-error-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <Input
              type="email"
              name="email"
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange}
              required
              startIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
              fullWidth
            />
          </div>

          <div>
            <Input
              type="password"
              name="password"
              label="Contraseña"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              startIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              fullWidth
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <a 
                href="/forgot-password" 
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿No tienes una cuenta?{" "}
              <a
                href="/signup"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </form>
      </Card>

      {/* Social Login - Solo Google */}
      <div className="text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-gray-50 via-white to-primary-25 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400">
              O continúa con
            </span>
          </div>
        </div>

        <div className="mt-6">
          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={isSubmitting}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

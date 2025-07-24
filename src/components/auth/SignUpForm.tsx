"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import Card from "@/components/ui/card/Card";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    role: "PROFESIONAL" as UserRole,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!form.fname || !form.lname || !form.email || !form.password) {
      setError("Todos los campos son obligatorios");
      setIsSubmitting(false);
      return;
    }

    if (!isChecked) {
      setError("Debes aceptar los términos y condiciones");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await register({
        fullName: `${form.fname} ${form.lname}`,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      if (result.success) {
        // Redirigir directamente al dashboard según el rol
        setTimeout(() => {
          switch (form.role) {
            case "PROFESIONAL":
              router.push("/profesional");
              break;
            case "EMPRESA":
              router.push("/empresa");
              break;
            case "ESPECIALISTA":
              router.push("/especialista");
              break;
            default:
              router.push("/");
          }
        }, 100);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setError("Error al registrar usuario. Por favor, intenta nuevamente.");
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
          router.push('/');
        }, 100);
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
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Crear cuenta
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Únete a nuestra plataforma y comienza tu viaje
        </p>
      </div>

      {/* Form */}
      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                name="fname"
                label="Nombre"
                placeholder="Juan"
                value={form.fname}
                onChange={handleChange}
                required
                startIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
            </div>
            <div>
              <Input
                type="text"
                name="lname"
                label="Apellido"
                placeholder="Pérez"
                value={form.lname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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
              type={showPassword ? "text" : "password"}
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
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              }
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Tipo de cuenta <span className="text-error-500">*</span>
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="PROFESIONAL">Profesional</option>
              <option value="EMPRESA">Empresa</option>
              <option value="ESPECIALISTA">Especialista</option>
            </select>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                Acepto los{" "}
                <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                  términos y condiciones
                </a>{" "}
                y la{" "}
                <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                  política de privacidad
                </a>
              </label>
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
              {isSubmitting
                ? "Creando cuenta..."
                : form.role === "PROFESIONAL"
                ? "Continuar con el registro"
                : "Registrarse"}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/signin"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </form>
      </Card>

      {/* Social Sign Up */}
      <div className="text-center mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-gray-50 via-white to-primary-25 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400">
              O regístrate con
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

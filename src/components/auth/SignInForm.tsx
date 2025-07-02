"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Label from "../form/Label";

const SignInForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Obtener el usuario para verificar su rol
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        // Redirigir según el rol
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/freelancer');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Error al iniciar sesión. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
        Iniciar Sesión
      </h3>
      <p className="mb-8 text-base text-gray-500">
        Ingresa tus credenciales para acceder
      </p>

      {/* Credenciales de ejemplo */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
          <strong>Credenciales de prueba:</strong>
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Admin: admin@freelasaas.com / admin123
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Freelancer: freelancer@example.com / freelancer123
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <Label>Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="Ingresa tu email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <Label>Contraseña</Label>
          <Input
            name="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-5 flex items-center justify-between">
          <Checkbox
            label="Recordarme"
            checked={rememberMe}
            onChange={setRememberMe}
          />

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-brand-500 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="mb-4.5">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-500 p-4 font-medium text-white transition hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-500">
            ¿No tienes una cuenta?{" "}
            <Link href="/signup" className="text-brand-500 hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
